import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
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
import { getDocumentTypeColor } from "@/lib/constants/documentTypeColors";

interface RecordsChartsRow1Props {
	recordsByStatus: { status: string; count: number }[];
	recordsByDocType: { documentType: string; count: number }[];
	chartColors: string[];
	documentTypeColorMap: { [key: string]: string };
}

export const RecordsChartsRow1 = ({
	recordsByStatus,
	recordsByDocType,
	chartColors,
	documentTypeColorMap,
}: RecordsChartsRow1Props) => (
	<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
		{/* Records by Status - Pie Chart */}
		<Card>
			<CardHeader>
				<CardTitle>Records by Status</CardTitle>
				<CardDescription>Distribution across status types</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						count: {
							label: "Records",
							color: "hsl(var(--chart-1))",
						},
					}}
					className="w-full h-64 sm:h-80 md:h-96"
				>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={recordsByStatus}
								innerRadius="50%"
								cornerRadius="10%"
								outerRadius="80%"
								cx="50%"
								cy="50%"
								labelLine={false}
								label={(entry) => {
									const data = entry as unknown as {
										status: string;
										count: number;
									};
									return `${data.status}: ${data.count}`;
								}}
								fill="var(--color-count)"
								dataKey="count"
							>
								{recordsByStatus.map(
									(_: { status: string; count: number }, index: number) => (
										<Cell
											key={`cell-${index}`}
											fill={chartColors[index % chartColors.length]}
										/>
									),
								)}
							</Pie>
							<ChartTooltip content={<ChartTooltipContent />} />
						</PieChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>

		{/* Records by Document Type - Pie Chart */}
		<Card>
			<CardHeader>
				<CardTitle>Records by Document Type</CardTitle>
				<CardDescription>Distribution across document types</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						count: {
							label: "Records",
							color: "hsl(var(--chart-2))",
						},
					}}
					className="w-full h-64 sm:h-80 md:h-96"
				>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={recordsByDocType}
								cx="50%"
								cy="50%"
								innerRadius="50%"
								cornerRadius="10%"
								outerRadius="80%"
								labelLine={false}
								label={(entry) => {
									const data = entry as unknown as {
										documentType: string;
										count: number;
									};
									return `${data.documentType}: ${data.count}`;
								}}
								fill="var(--color-count)"
								dataKey="count"
							>
								{recordsByDocType.map(
									(
										_: { documentType: string; count: number },
										index: number,
									) => (
										<Cell
											key={`cell-${index}`}
											fill={getDocumentTypeColor(
												_.documentType,
												documentTypeColorMap,
											)}
										/>
									),
								)}
							</Pie>
							<ChartTooltip content={<ChartTooltipContent />} />
						</PieChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	</div>
);
