import {
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
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

interface OfficesDetailedStatsChartProps {
	officesStats: { officeId: string; officeName: string; userCount: number }[];
	themeColors: {
		chart1: string;
		chart2: string;
		chart3: string;
		chart4: string;
		chart5: string;
	};
}

export const OfficesDetailedStatsChart = ({
	officesStats,
	themeColors,
}: OfficesDetailedStatsChartProps) => (
	<Card>
		<CardHeader>
			<CardTitle>Offices Detailed Statistics</CardTitle>
			<CardDescription>User count per office</CardDescription>
		</CardHeader>
		<CardContent>
			<ChartContainer
				config={{
					userCount: {
						label: "Users",
						color: "hsl(var(--chart-5))",
					},
				}}
				className="w-full h-64 sm:h-80 md:h-96"
			>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={officesStats}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="officeName"
							angle={-45}
							textAnchor="end"
							height={80}
						/>
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Bar dataKey="userCount" fill={themeColors.chart5} />
					</BarChart>
				</ResponsiveContainer>
			</ChartContainer>
		</CardContent>
	</Card>
);
