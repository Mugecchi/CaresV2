import { KPICard } from "./KPICard";

interface UsersOverviewSectionProps {
	usersOverview: {
		totalUsers: number;
		activeUsers: number;
		inactiveUsers: number;
	} | null;
}

export const UsersOverviewSection = ({
	usersOverview,
}: UsersOverviewSectionProps) => (
	<div>
		<h2 className="text-2xl font-bold mb-4">Users Overview</h2>
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<KPICard
				title="Total Users"
				value={usersOverview?.totalUsers || 0}
				description="All users"
			/>
			<KPICard
				title="Active Users"
				value={usersOverview?.activeUsers || 0}
				description="Currently active"
			/>
			<KPICard
				title="Inactive Users"
				value={usersOverview?.inactiveUsers || 0}
				description="Not active"
			/>
		</div>
	</div>
);
