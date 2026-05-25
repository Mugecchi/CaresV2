from pdf2image import convert_from_path
import os
import cv2
import numpy as np
import pytesseract
import re
from structure import structure_ordinance
import json
output_folder = "pages"
processed_folder = "processed_pages"
first_page_only = False

os.makedirs(output_folder, exist_ok=True)
os.makedirs(processed_folder, exist_ok=True)

# Convert PDF
if first_page_only:
    pages = convert_from_path("sample.pdf", 300, first_page=1, last_page=1)
else:
    pages = convert_from_path("sample.pdf", 300)

# Save pages
for i, page in enumerate(pages):
    page.save(f"{output_folder}/page_{i+1}.png", "PNG")

print("Saved successfully")


def preprocess(img):

    # 1. upscale (IMPORTANT for OCR)
    img = cv2.resize(img, None, fx=2, fy=2)

    # 2. grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 3. denoise
    gray = cv2.fastNlMeansDenoising(gray, h=25)

    # 4. threshold
    thresh = cv2.threshold(
        gray, 0, 255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )[1]

    # 5. deskew
    coords = np.column_stack(np.where(thresh > 0))

    if len(coords) > 0:
        angle = cv2.minAreaRect(coords)[-1]
        angle = -(90 + angle) if angle < -45 else -angle

        (h, w) = thresh.shape[:2]
        M = cv2.getRotationMatrix2D((w//2, h//2), angle, 1.0)
        thresh = cv2.warpAffine(
            thresh, M, (w, h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_REPLICATE
        )

    # 6. light cleanup
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 1))
    clean = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    return clean


# OCR CONFIG (important)
custom_config = r'--oem 3 --psm 4'

all_text = []

# PROCESS + OCR EACH PAGE
for i in range(len(pages)):

    img = cv2.imread(f"{output_folder}/page_{i+1}.png")

    processed = preprocess(img)

    # save processed image
    cv2.imwrite(f"{processed_folder}/processed_{i+1}.png", processed)

    # OCR
    text = pytesseract.image_to_string(processed, config=custom_config)

    # clean text
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)

    all_text.append(text)

print("Done OCR")

all_structured = []

full_text = "\n".join(all_text)

structured = structure_ordinance(full_text)
# Save JSON file
with open("record_data.json", "w") as f:
    json.dump(structured, f, indent=4)

print("Structured JSON saved")