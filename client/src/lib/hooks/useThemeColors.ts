import { useState, useEffect } from "react";
import { getCSSVariableColor } from "@/lib/utils/colors";

export const useThemeColors = () => {
	const [colors, setColors] = useState({
		chart1: "#433aa9",
		chart2: "#21498a",
		chart3: "#22946e",
		chart4: "#a87a2a",
		chart5: "#9c2121",
	});

	useEffect(() => {
		const updateColors = () => {
			setColors({
				chart1: getCSSVariableColor("--chart-1"),
				chart2: getCSSVariableColor("--chart-2"),
				chart3: getCSSVariableColor("--chart-3"),
				chart4: getCSSVariableColor("--chart-4"),
				chart5: getCSSVariableColor("--chart-5"),
			});
		};

		updateColors();

		// Watch for theme changes
		const observer = new MutationObserver(updateColors);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => observer.disconnect();
	}, []);

	return colors;
};
