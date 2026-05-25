import {
	Bar,
	BarChart,
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

interface DateRangeDistributionChartProps {
	dateRangeDistribution: Record<string, string | number>[] | null;
	documentTypes: string[];
	getDocumentTypeColor: (docType: string) => string;
}

export const DateRangeDistributionChart = ({
	dateRangeDistribution,
	documentTypes,
	getDocumentTypeColor,
}: DateRangeDistributionChartProps) => (
	<Card>
		<CardHeader>
			<CardTitle>Records by Date Range</CardTitle>
			<CardDescription>
				Records created by document type across time periods
			</CardDescription>
		</CardHeader>
		<CardContent>
			<ChartContainer
				config={{
					count: {
						label: "Records",
						color: "hsl(var(--chart-4))",
					},
				}}
				className="w-full h-64 sm:h-80 md:h-96"
			>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={dateRangeDistribution || []} layout="vertical">
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis type="number" />
						<YAxis dataKey="range" type="category" />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Legend wrapperStyle={{ paddingTop: "20px" }} />
						{documentTypes.map((docType: string, i: number) => (
							<Bar
								radius={
									i === 0
										? [10, 0, 0, 10]
										: i === documentTypes.length - 1
											? [0, 10, 10, 0]
											: 0
								}
								key={`bar-${docType}`}
								dataKey={docType}
								stackId="stack"
								fill={getDocumentTypeColor(docType)}
								name={docType}
							/>
						))}
					</BarChart>
				</ResponsiveContainer>
			</ChartContainer>
		</CardContent>
	</Card>
);
