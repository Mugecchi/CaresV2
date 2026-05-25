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

interface UsersChartsRowProps {
	usersByRole: { role: string; count: number }[];
	usersActivityStatus: {
		active: { label: string; count: number };
		inactive: { label: string; count: number };
	} | null;
	chartColors: string[];
}

export const UsersChartsRow = ({
	usersByRole,
	usersActivityStatus,
	chartColors,
}: UsersChartsRowProps) => (
	<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
		{/* Users by Role - Pie Chart */}
		<Card>
			<CardHeader>
				<CardTitle>Users by Role</CardTitle>
				<CardDescription>Distribution across user roles</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						count: {
							label: "Users",
							color: "hsl(var(--chart-3))",
						},
					}}
					className="w-full h-64 sm:h-80 md:h-96"
				>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={usersByRole}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={(entry) => {
									const data = entry as unknown as {
										role: string;
										count: number;
									};
									return `${data.role}: ${data.count}`;
								}}
								outerRadius={100}
								fill="var(--color-count)"
								dataKey="count"
							>
								{usersByRole.map(
									(_: { role: string; count: number }, index: number) => (
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

		{/* Users Activity Status - Pie Chart */}
		<Card>
			<CardHeader>
				<CardTitle>Users Activity Status</CardTitle>
				<CardDescription>Active vs inactive users</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						count: {
							label: "Users",
							color: "hsl(var(--chart-5))",
						},
					}}
					className="w-full h-64 sm:h-80 md:h-96"
				>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={[
									{
										label: usersActivityStatus?.active?.label,
										count: usersActivityStatus?.active?.count,
									},
									{
										label: usersActivityStatus?.inactive?.label,
										count: usersActivityStatus?.inactive?.count,
									},
								]}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={(entry) => {
									const data = entry as unknown as {
										label: string;
										count: number;
									};
									return `${data.label}: ${data.count}`;
								}}
								outerRadius={100}
								fill="var(--color-count)"
								dataKey="count"
							>
								{[0, 1].map((index: number) => (
									<Cell
										key={`cell-${index}`}
										fill={chartColors[index % chartColors.length]}
									/>
								))}
							</Pie>
							<ChartTooltip content={<ChartTooltipContent />} />
						</PieChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	</div>
);
