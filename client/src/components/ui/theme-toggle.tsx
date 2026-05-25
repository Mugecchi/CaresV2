import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	applyTheme,
	getPreferredTheme,
	persistTheme,
	type Theme,
} from "@/lib/theme";

import { Moon, Sun } from "@phosphor-icons/react";

const ThemeToggle = () => {
	const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());

	useEffect(() => {
		applyTheme(theme);
		persistTheme(theme);
	}, [theme]);

	const isDark = theme === "dark";

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="relative overflow-hidden rounded-full"
		>
			<Sun
				size={18}
				weight="fill"
				className={`
					absolute transition-all duration-300
					${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}
				`}
			/>

			<Moon
				size={18}
				weight="fill"
				className={`
					absolute transition-all duration-300
					${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}
				`}
			/>

			<span className="sr-only">Toggle theme</span>
		</Button>
	);
};

export default ThemeToggle;
