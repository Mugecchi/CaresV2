import {
	Area,
	AreaChart,
	CartesianGrid,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Legend,
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

interface ViewersTrendChartProps {
	trend: { date: string; count: number }[];
	themeColors: {
		chart1: string;
		chart2: string;
		chart3: string;
		chart4: string;
		chart5: string;
	};
}

export const ViewersTrendChart = ({
	trend,
	themeColors,
}: ViewersTrendChartProps) => (
	<Card>
		<CardHeader>
			<CardTitle>Viewers Trend</CardTitle>
			<CardDescription>Monthly viewer count over time</CardDescription>
		</CardHeader>
		<CardContent>
			<ChartContainer
				config={{
					count: {
						label: "Viewers",
						color: "var(--chart-1)",
					},
				}}
				className="w-full h-64 sm:h-80 md:h-96"
			>
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={trend || []}
						margin={{
							left: 12,
							right: 12,
							bottom: 60,
						}}
					>
						<defs>
							<linearGradient id="viewersGradient" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor={themeColors.chart1}
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor={themeColors.chart1}
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
						/>
						<YAxis />
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Legend wrapperStyle={{ paddingTop: "20px" }} />
						<Area
							type="natural"
							dataKey="count"
							stroke={themeColors.chart1}
							fill="url(#viewersGradient)"
							fillOpacity={0.4}
							name="Viewers"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</ChartContainer>
		</CardContent>
	</Card>
);
