import { KPICard } from "./KPICard";

interface RecordsOverviewSectionProps {
	recordsOverview: {
		totalRecords: number;
		activeRecords: number;
		inactiveRecords: number;
		deletedRecords: number;
	} | null;
}

export const RecordsOverviewSection = ({
	recordsOverview,
}: RecordsOverviewSectionProps) => (
	<div>
		<h2 className="text-2xl font-bold mb-4">Records Overview</h2>
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<KPICard
				title="Total Records"
				value={recordsOverview?.totalRecords || 0}
				description="Active records"
			/>
			<KPICard
				title="Active Records"
				value={recordsOverview?.activeRecords || 0}
				description="Currently active"
			/>
			<KPICard
				title="Inactive Records"
				value={recordsOverview?.inactiveRecords || 0}
				description="Not active"
			/>
			<KPICard
				title="Deleted Records"
				value={recordsOverview?.deletedRecords || 0}
				description="Archived records"
			/>
		</div>
	</div>
);
