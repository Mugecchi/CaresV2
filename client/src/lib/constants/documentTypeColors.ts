export const getDocumentTypeColorMap = (themeColors: {
	chart1: string;
	chart2: string;
	chart3: string;
	chart4: string;
	chart5: string;
}) => ({
	Memo: themeColors.chart2,
	"Office Order": themeColors.chart1,
	"Executive Order": themeColors.chart3,
	Ordinance: themeColors.chart4,
	Resolution: themeColors.chart5,
});

export const getDocumentTypeColor = (
	documentType: string,
	colorMap: { [key: string]: string },
): string => {
	return colorMap[documentType] || "#999999";
};
