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

interface RecordsCreatedTimelineChartProps {
	createdTimeline: Record<string, string | number>[];
	documentTypes: string[];
	getDocumentTypeColor: (docType: string) => string;
}

export const RecordsCreatedTimelineChart = ({
	createdTimeline,
	documentTypes,
	getDocumentTypeColor,
}: RecordsCreatedTimelineChartProps) => (
	<Card>
		<CardHeader>
			<CardTitle>Records Created Timeline</CardTitle>
			<CardDescription>
				Records created over time by document type
			</CardDescription>
		</CardHeader>
		<CardContent>
			<ChartContainer
				config={{
					count: {
						label: "Records Created",
						color: "var(--chart-1)",
					},
				}}
				className="w-full h-64 sm:h-80 md:h-96"
			>
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						accessibilityLayer
						data={createdTimeline}
						margin={{
							left: 12,
							right: 12,
							bottom: 60,
						}}
					>
						<defs>
							{documentTypes.map((docType: string) => {
								const color = getDocumentTypeColor(docType);
								const safeId = docType.replace(/\s+/g, "-");
								return (
									<linearGradient
										key={`fillGradient-${docType}`}
										id={`fillGradient-${safeId}`}
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop offset="5%" stopColor={color} stopOpacity={0.8} />
										<stop offset="95%" stopColor={color} stopOpacity={0.1} />
									</linearGradient>
								);
							})}
						</defs>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
						/>
						<YAxis />
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Legend wrapperStyle={{ paddingTop: "20px" }} />
						{createdTimeline.length > 0 &&
							documentTypes.map((documentType: string) => (
								<Area
									key={`area-${documentType}`}
									dataKey={documentType}
									stackId="a"
									type="natural"
									fill={`url(#fillGradient-${documentType.replace(/\s+/g, "-")})`}
									stroke={getDocumentTypeColor(documentType)}
									fillOpacity={0.4}
									name={documentType}
								/>
							))}
					</AreaChart>
				</ResponsiveContainer>
			</ChartContainer>
		</CardContent>
	</Card>
);
