"use client";

import React from "react";
import {
	useRecordsOverview,
	useRecordsByStatus,
	useRecordsByDocumentType,
	useRecordsBySponsor,
	useTopDownloadedRecords,
	useRecordsCreatedTimeline,
	useRecordsDateRangeDistribution,
	useUsersOverview,
	useUsersByRole,
	useUsersActivityStatus,
	useUsersByOffice,
	useOfficesDetailedStats,
	useViewerStats,
} from "@/lib/api/dashboardApi";
import { useThemeColors } from "@/lib/hooks/useThemeColors";
import {
	getDocumentTypeColorMap,
	getDocumentTypeColor,
} from "@/lib/constants/documentTypeColors";
import { RecordsOverviewSection } from "./components/RecordsOverviewSection";
import { RecordsChartsRow1 } from "./components/RecordsChartsRow1";
import { RecordsChartsRow2 } from "./components/RecordsChartsRow2";
import { RecordsCreatedTimelineChart } from "./components/RecordsCreatedTimelineChart";
import { DateRangeDistributionChart } from "./components/DateRangeDistributionChart";
import { UsersOverviewSection } from "./components/UsersOverviewSection";
import { UsersChartsRow } from "./components/UsersChartsRow";
import { UsersByOfficeChart } from "./components/UsersByOfficeChart";
import { OfficesOverviewSection } from "./components/OfficesOverviewSection";
import { OfficesDetailedStatsChart } from "./components/OfficesDetailedStatsChart";
import { ViewersOverviewSection } from "./components/ViewersOverviewSection";
import { ViewersTrendChart } from "./components/ViewersTrendChart";

const Dashboard = React.memo(() => {
	// Get theme colors that react to dark/light mode changes
	const themeColors = useThemeColors();

	// TanStack Query hooks
	const { data: recordsOverview } = useRecordsOverview();
	const { data: recordsByStatus = [] } = useRecordsByStatus();
	const { data: recordsByDocType = [] } = useRecordsByDocumentType();
	const { data: recordsBySponsor = [] } = useRecordsBySponsor();
	const { data: topDownloaded = [] } = useTopDownloadedRecords(5);
	const { data: createdTimeline = [] } = useRecordsCreatedTimeline();
	const { data: dateRangeDistribution } = useRecordsDateRangeDistribution();
	const { data: usersOverview } = useUsersOverview();
	const { data: usersByRole = [] } = useUsersByRole();
	const { data: usersActivityStatus } = useUsersActivityStatus();
	const { data: usersByOffice = [] } = useUsersByOffice();
	const { data: officesStats = [] } = useOfficesDetailedStats();
	const { data: viewerStats } = useViewerStats();

	// Chart colors array from theme - memoized to prevent unnecessary recalculations
	const chartColors = React.useMemo(
		() => [
			themeColors.chart1,
			themeColors.chart2,
			themeColors.chart3,
			themeColors.chart4,
			themeColors.chart5,
		],
		[themeColors],
	);

	// Consistent color mapping for document types using theme colors - memoized
	const documentTypeColorMap = React.useMemo(
		() => getDocumentTypeColorMap(themeColors),
		[themeColors],
	);

	const getDocumentTypeColorForChart = React.useCallback(
		(documentType: string): string => {
			return getDocumentTypeColor(documentType, documentTypeColorMap);
		},
		[documentTypeColorMap],
	);

	// Get all unique document types from timeline data - memoized
	const documentTypes = React.useMemo(
		() =>
			Array.from(
				new Set(
					createdTimeline.flatMap((item: Record<string, string | number>) =>
						Object.keys(item).filter((key) => key !== "month"),
					),
				),
			).sort() as string[],
		[createdTimeline],
	);

	// Check if all queries are loading
	const isLoading = React.useMemo(
		() =>
			!recordsOverview ||
			!usersOverview ||
			!dateRangeDistribution ||
			!viewerStats,
		[recordsOverview, usersOverview, dateRangeDistribution, viewerStats],
	);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p>Loading dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full overflow-auto space-y-6 p-4 md:p-6">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-muted-foreground">
					Welcome to your analytics dashboard
				</p>
			</div>

			{/* Records Overview KPIs */}
			<RecordsOverviewSection recordsOverview={recordsOverview} />

			{/* Records Charts Row 1 */}
			<RecordsChartsRow1
				recordsByStatus={recordsByStatus}
				recordsByDocType={recordsByDocType}
				chartColors={chartColors}
				documentTypeColorMap={documentTypeColorMap}
			/>

			{/* Records Charts Row 2 */}
			<RecordsChartsRow2
				recordsBySponsor={recordsBySponsor}
				topDownloaded={topDownloaded}
				themeColors={themeColors}
			/>

			{/* Records Created Timeline - Area Chart by Document Type */}
			<RecordsCreatedTimelineChart
				createdTimeline={createdTimeline}
				documentTypes={documentTypes}
				getDocumentTypeColor={getDocumentTypeColorForChart}
			/>

			{/* Date Range Distribution */}
			<DateRangeDistributionChart
				dateRangeDistribution={dateRangeDistribution}
				documentTypes={documentTypes}
				getDocumentTypeColor={getDocumentTypeColorForChart}
			/>

			{/* Users Overview KPIs */}
			<UsersOverviewSection usersOverview={usersOverview} />

			{/* Users Charts */}
			<UsersChartsRow
				usersByRole={usersByRole}
				usersActivityStatus={usersActivityStatus}
				chartColors={chartColors}
			/>

			{/* Users by Office - Bar Chart */}
			<UsersByOfficeChart
				usersByOffice={usersByOffice}
				themeColors={themeColors}
			/>

			{/* Offices Overview KPI */}
			<OfficesOverviewSection officesStats={officesStats} />

			{/* Offices Detailed Stats - Bar Chart */}
			<OfficesDetailedStatsChart
				officesStats={officesStats}
				themeColors={themeColors}
			/>

			{/* Viewers Overview KPIs */}
			<ViewersOverviewSection viewerStats={viewerStats} />

			{/* Viewers Trend Chart */}
			<ViewersTrendChart
				trend={viewerStats?.trend || []}
				themeColors={themeColors}
			/>
		</div>
	);
});

Dashboard.displayName = "Dashboard";
export default Dashboard;
