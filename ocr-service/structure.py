import re

HEADINGS = [
    "objectives",
    "target beneficiaries",
    "whereas",
    "section",
    "effectivity"
]


def _normalize_text(text):
    # Preserve line boundaries but normalize internal spacing for OCR noise.
    text = re.sub(r'\r\n?', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n+', '\n', text)
    return text.strip()


def _detect_document_type(text):
    if re.search(r'\bEXECUTIVE\s+ORDER\b', text, re.IGNORECASE):
        return "executive_order"
    if re.search(r'\bRESOLUTION\b', text, re.IGNORECASE):
        return "resolution"
    if re.search(r'\bORDINANCE\b', text, re.IGNORECASE):
        return "ordinance"
    return None


def _extract_document_no(text, doc_type):
    type_patterns = {
        "ordinance": r'ORD(?:INANCE)?',
        "resolution": r'RES(?:OLUTION)?',
        "executive_order": r'EXECUTIVE\s+ORDER'
    }

    keyword = type_patterns.get(doc_type)
    if not keyword:
        return None

    match_no = re.search(
        rf'{keyword}\s*(?:NO\.?|NUMBER)?\s*([0-9]{{2,4}}\s*[-\u2013\u2014]\s*[0-9]{{1,6}}|[0-9]+)',
        text,
        re.IGNORECASE
    )
    if not match_no:
        return None

    return re.sub(r'\s*[-\u2013\u2014]\s*', '-', match_no.group(1))


def _extract_heading_block(text, start_patterns, end_patterns):
    start_regex = r'(?:' + '|'.join(start_patterns) + r')'
    end_regex = r'(?:' + '|'.join(end_patterns) + r')'
    match = re.search(
        rf'{start_regex}\s*[:\-\.]?\s*(.*?)(?={end_regex}|$)',
        text,
        re.IGNORECASE | re.DOTALL
    )
    if match:
        value = re.sub(r'\s+', ' ', match.group(1)).strip(' .;,:')
        return value or None
    return None


def _clean_extracted_text(value):
    if not value:
        return None

    cleaned = value
    # Remove common OCR footer artifacts.
    cleaned = re.sub(r'\bForm\s+No\.?[^A-Za-z0-9]{0,3}[A-Za-z0-9\-\.\s]{0,80}', ' ', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\s*[\|{}]+\s*$', '', cleaned)
    cleaned = re.sub(r'\s*\)\s*$', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip(' .;,:')
    return cleaned or None


def _extract_title(text, doc_type):
    type_patterns = {
        "ordinance": r'ORD(?:INANCE)?',
        "resolution": r'RES(?:OLUTION)?',
        "executive_order": r'EXECUTIVE\s+ORDER'
    }

    keyword = type_patterns.get(doc_type)
    if not keyword:
        return None

    # Prefer title immediately after "<TYPE> NO. <number>"
    after_number = re.search(
        rf'{keyword}\s*(?:NO\.?|NUMBER)?\s*[0-9]{{2,4}}(?:\s*[-\u2013\u2014]\s*[0-9]{{1,6}})?\s*(.*?)(?=\(\s*(?:Sponsored\s+by|Sponsor)\s*[:\-]?|\b(?:Sponsored\s+by|Sponsor)\b\s*[:\-]?|\bWHEREAS\b|\bNOW\s+THEREFORE\b|\bWHEREFORE\b|\bSECTION\s*\d+\b|\bRESOLVED\b|$)',
        text,
        re.IGNORECASE
    )
    if after_number:
        candidate = after_number.group(1).strip(' .;,:')
        if candidate:
            return candidate

    # Fallback if OCR misses the number.
    generic = re.search(
        rf'{keyword}\s*(.*?)(?=\(\s*(?:Sponsored\s+by|Sponsor)\s*[:\-]?|\b(?:Sponsored\s+by|Sponsor)\b\s*[:\-]?|\bWHEREAS\b|\bNOW\s+THEREFORE\b|\bWHEREFORE\b|\bSECTION\s*\d+\b|\bRESOLVED\b|$)',
        text,
        re.IGNORECASE
    )
    if generic:
        candidate = generic.group(1).strip(' .;,:')
        if candidate:
            return candidate

    return None


def _extract_budget(text):
    # Prefer amounts that appear in budget/appropriation context.
    keyword_pattern = re.compile(
        r'\b(?:appropriat(?:e|ed|ion)|budget(?:ary)?|allocated?|amount\s+of|funds\s+therefor|economic\s+relief\s+assistance)\b',
        re.IGNORECASE
    )

    budget_context = []
    for hit in keyword_pattern.finditer(text):
        start = max(0, hit.start() - 120)
        end = min(len(text), hit.end() + 180)
        budget_context.append(text[start:end])

    amount_patterns = [
        r'(?:\bP\s*|\bPHP\s*|\bPhp\s*|₱\s*)\d{1,3}(?:,\d{3})*(?:\.\d{2})?',
        r'\(\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*\)\s*PESOS?',
        r'\(\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*\)',
        r'\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*PESOS?\s*(?:EACH|PER\s+[A-Z]+)?\b',
        r'\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:EACH|PER\s+[A-Z]+)\b'
    ]

    for chunk in budget_context:
        for pattern in amount_patterns:
            m = re.search(pattern, chunk, re.IGNORECASE)
            if m:
                return m.group(0).strip()

    # Fallback: any peso amount in the document.
    for pattern in amount_patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            return m.group(0).strip()

    return None


def structure_document(text):

    data = {
        "document_type": None,
        "document_no": None,
        "title": None,
        "date": None,
        "sponsor": None,
        "budget": None,
        "objectives": None,
        "target_beneficiaries": None,
        "whereas": None,
        "section": None,
        "effectivity": None,
    }

    # Normalize text
    text = _normalize_text(text)
    flat_text = re.sub(r'\s+', ' ', text)

    # 1. Document type and number
    doc_type = _detect_document_type(flat_text)
    data["document_type"] = doc_type

    doc_no = _extract_document_no(flat_text, doc_type)
    data["document_no"] = doc_no

    if doc_type == "ordinance":
        data["ordinance_no"] = doc_no
    elif doc_type == "resolution":
        data["resolution_no"] = doc_no
    elif doc_type == "executive_order":
        data["executive_order_no"] = doc_no

    # 2. Date (basic patterns)
    match_date = re.search(
        r'(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},\s+\d{4}\b)',
        flat_text,
        re.IGNORECASE
    )
    if match_date:
        data["date"] = match_date.group(1)

    # 3. Sponsor / Co-sponsor
    match_sponsor = re.search(
        r'(?:sponsored\s+by|sponsor)\s*[:\-]?\s*(.*?)(?=\)|\bWHEREAS\b|\bSECTION\b|\bNOW\s+THEREFORE\b|\bWHEREFORE\b|\bRESOLVED\b|$)',
        flat_text,
        re.IGNORECASE
    )
    if match_sponsor:
        sponsor_block = match_sponsor.group(1).strip(' .;,:')
        sponsor_main = re.search(
            r'^(.*?)(?=\bCo\s*[- ]?Sponsor\b|$)',
            sponsor_block,
            re.IGNORECASE
        )
        co_sponsor = re.search(
            r'\bCo\s*[- ]?Sponsor\s*[:\-]?\s*(.*)$',
            sponsor_block,
            re.IGNORECASE
        )

        if sponsor_main and co_sponsor:
            data["sponsor"] = f"{sponsor_main.group(1).strip(' .;,:')} | Co-sponsor: {co_sponsor.group(1).strip(' .;,:')}"
        elif sponsor_main:
            data["sponsor"] = sponsor_main.group(1).strip(' .;,:')

    # 4. Title
    data["title"] = _extract_title(flat_text, doc_type)

    # 5. Additional heading fields
    data["objectives"] = _extract_heading_block(
        text,
        [r'OBJECTIVES?', r'SECTION\s*\d+\s*\.\s*OBJECTIVES?'],
        [r'TARGET\s+BENEFICIARIES', r'BENEFICIARIES\s+OF\s+THE\s+PROGRAM', r'WHEREAS', r'SECTION\s*\d+\s*\.', r'EFFECTIVITY', r'Form\s+No\.?']
    )

    data["target_beneficiaries"] = _extract_heading_block(
        text,
        [r'TARGET\s+BENEFICIARIES', r'BENEFICIARIES\s+OF\s+THE\s+PROGRAM'],
        [r'BENEFITS\s+AVAILABLE', r'WHEREAS', r'SECTION\s*\d+\s*\.', r'EFFECTIVITY', r'Form\s+No\.?']
    )

    whereas_matches = re.findall(
        r'\bWHEREAS[,;:]?\s*(.*?)(?=\bWHEREAS\b|\bNOW\s+THEREFORE\b|\bBE\s+IT\s+(?:ORDAINED|RESOLVED)\b|\bSECTION\s*\d+\b|$)',
        flat_text,
        re.IGNORECASE
    )
    if whereas_matches:
        data["whereas"] = ' '.join([w.strip(' .;,:') for w in whereas_matches if w.strip()])

    data["section"] = _extract_heading_block(
        text,
        [r'SECTION\s*1\s*\.', r'SECTION\s*\d+\s*\.'],
        [r'EFFECTIVITY\s+CLAUSE', r'SECTION\s*\d+\s*\.', r'ENACTED', r'ADOPTED', r'APPROVED', r'Form\s+No\.?', r'$']
    )

    data["effectivity"] = _extract_heading_block(
        text,
        [r'EFFECTIVITY\s+CLAUSE', r'EFFECTIVITY'],
        [r'ENACTED', r'ADOPTED', r'APPROVED', r'Form\s+No\.?', r'$']
    )

    data["budget"] = _extract_budget(flat_text)

    # 6. Final cleanup of extracted free-text fields.
    for key in ["title", "sponsor", "objectives", "target_beneficiaries", "whereas", "section", "effectivity"]:
        data[key] = _clean_extracted_text(data.get(key))

  
    return data


def structure_ordinance(text):
    # Backward-compatible entrypoint used by convertPdf.py
    return structure_document(text)