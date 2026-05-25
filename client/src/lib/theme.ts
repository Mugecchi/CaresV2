export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export function getPreferredTheme(): Theme {
	if (typeof window === "undefined") {
		return "light";
	}

	const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
	if (storedTheme === "light" || storedTheme === "dark") {
		return storedTheme;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function applyTheme(theme: Theme) {
	if (typeof document === "undefined") {
		return;
	}

	document.documentElement.classList.toggle("dark", theme === "dark");
	document.documentElement.style.colorScheme = theme;
}

export function initializeTheme() {
	const theme = getPreferredTheme();
	applyTheme(theme);
	return theme;
}

export function persistTheme(theme: Theme) {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}
