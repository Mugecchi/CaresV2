import {
	Bar,
	BarChart,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface RecordsChartsRow2Props {
	recordsBySponsor: { sponsor: string; count: number }[];
	topDownloaded: { title: string; downloadCount: number }[];
	themeColors: {
		chart1: string;
		chart2: string;
		chart3: string;
		chart4: string;
		chart5: string;
	};
}

export const RecordsChartsRow2 = ({
	recordsBySponsor,
	topDownloaded,
	themeColors,
}: RecordsChartsRow2Props) => (
	<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
		{/* Records by Sponsor - Bar Chart */}
		<Card>
			<CardHeader>
				<CardTitle>Records by Sponsor</CardTitle>
				<CardDescription>Top sponsors by record count</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						count: {
							label: "Count",
							color: "hsl(var(--chart-1))",
						},
					}}
					className="w-full h-64 sm:h-80 md:h-96"
				>
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={recordsBySponsor}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey="sponsor"
								angle={-45}
								textAnchor="end"
								height={80}
							/>
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar dataKey="count" fill={themeColors.chart1} />
						</BarChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>

		{/* Top Downloaded Records - Bar Chart */}
		<Card>
			<CardHeader>
				<CardTitle>Top Downloaded Records</CardTitle>
				<CardDescription>Most accessed records</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						downloadCount: {
							label: "Downloads",
							color: "hsl(var(--chart-2))",
						},
					}}
					className="w-full h-64 sm:h-80 md:h-96"
				>
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={topDownloaded} layout="vertical">
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis type="number" />
							<YAxis dataKey="title" type="category" width={150} />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar dataKey="downloadCount" fill={themeColors.chart2} />
						</BarChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	</div>
);
