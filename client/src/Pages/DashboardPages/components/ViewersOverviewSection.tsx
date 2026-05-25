import { KPICard } from "./KPICard";

interface ViewersOverviewSectionProps {
	viewerStats: {
		totalViewers: number;
		uniqueIPs: number;
		uniqueUserAgents: number;
	} | null;
}

export const ViewersOverviewSection = ({
	viewerStats,
}: ViewersOverviewSectionProps) => (
	<div>
		<h2 className="text-2xl font-bold mb-4">Viewers Overview</h2>
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<KPICard
				title="Total Viewers"
				value={viewerStats?.totalViewers || 0}
				description="Page views"
			/>
			<KPICard
				title="Unique IPs"
				value={viewerStats?.uniqueIPs || 0}
				description="Unique visitors"
			/>
			<KPICard
				title="Unique User Agents"
				value={viewerStats?.uniqueUserAgents || 0}
				description="Different devices/browsers"
			/>
		</div>
	</div>
);
