import { useQuery } from "@tanstack/react-query";
import api from "./axios";

// Query function definitions
const fetchRecordsOverview = async () => {
	const response = await api.get("/dashboard/records/overview");
	return response.data;
};

const fetchRecordsByStatus = async () => {
	const response = await api.get("/dashboard/records/by-status");
	return response.data;
};

const fetchRecordsByDocumentType = async () => {
	const response = await api.get("/dashboard/records/by-document-type");
	return response.data;
};

const fetchRecordsBySponsor = async () => {
	const response = await api.get("/dashboard/records/by-sponsor");
	return response.data;
};

const fetchTopDownloadedRecords = async (limit: number = 10) => {
	const response = await api.get("/dashboard/records/top-downloaded", {
		params: { limit },
	});
	return response.data;
};

const fetchRecordsCreatedTimeline = async () => {
	const response = await api.get("/dashboard/records/timeline/created");
	return response.data;
};

const fetchRecordsIssuedTimeline = async () => {
	const response = await api.get("/dashboard/records/timeline/issued");
	return response.data;
};

const fetchRecordsDateRangeDistribution = async () => {
	const response = await api.get("/dashboard/records/date-range-distribution");
	return response.data;
};

const fetchUsersOverview = async () => {
	const response = await api.get("/dashboard/users/overview");
	return response.data;
};

const fetchUsersByRole = async () => {
	const response = await api.get("/dashboard/users/by-role");
	return response.data;
};

const fetchUsersActivityStatus = async () => {
	const response = await api.get("/dashboard/users/activity-status");
	return response.data;
};

const fetchUsersByOffice = async () => {
	const response = await api.get("/dashboard/users/by-office");
	return response.data;
};

const fetchOfficesOverview = async () => {
	const response = await api.get("/dashboard/offices/overview");
	return response.data;
};

const fetchOfficesDetailedStats = async () => {
	const response = await api.get("/dashboard/offices/detailed-stats");
	return response.data;
};

const fetchViewerStats = async () => {
	const response = await api.get("/dashboard/viewer-stats");
	return response.data;
};

const fetchComprehensiveDashboardData = async () => {
	const response = await api.get("/dashboard/comprehensive");
	return response.data;
};

// TanStack Query hooks - Records
export const useRecordsOverview = () =>
	useQuery({
		queryKey: ["dashboard", "records", "overview"],
		queryFn: fetchRecordsOverview,
	});

export const useRecordsByStatus = () =>
	useQuery({
		queryKey: ["dashboard", "records", "by-status"],
		queryFn: fetchRecordsByStatus,
	});

export const useRecordsByDocumentType = () =>
	useQuery({
		queryKey: ["dashboard", "records", "by-document-type"],
		queryFn: fetchRecordsByDocumentType,
	});

export const useRecordsBySponsor = () =>
	useQuery({
		queryKey: ["dashboard", "records", "by-sponsor"],
		queryFn: fetchRecordsBySponsor,
	});

export const useTopDownloadedRecords = (limit: number = 10) =>
	useQuery({
		queryKey: ["dashboard", "records", "top-downloaded", limit],
		queryFn: () => fetchTopDownloadedRecords(limit),
	});

export const useRecordsCreatedTimeline = () =>
	useQuery({
		queryKey: ["dashboard", "records", "timeline", "created"],
		queryFn: fetchRecordsCreatedTimeline,
	});

export const useRecordsIssuedTimeline = () =>
	useQuery({
		queryKey: ["dashboard", "records", "timeline", "issued"],
		queryFn: fetchRecordsIssuedTimeline,
	});

export const useRecordsDateRangeDistribution = () =>
	useQuery({
		queryKey: ["dashboard", "records", "date-range-distribution"],
		queryFn: fetchRecordsDateRangeDistribution,
	});

// TanStack Query hooks - Users
export const useUsersOverview = () =>
	useQuery({
		queryKey: ["dashboard", "users", "overview"],
		queryFn: fetchUsersOverview,
	});

export const useUsersByRole = () =>
	useQuery({
		queryKey: ["dashboard", "users", "by-role"],
		queryFn: fetchUsersByRole,
	});

export const useUsersActivityStatus = () =>
	useQuery({
		queryKey: ["dashboard", "users", "activity-status"],
		queryFn: fetchUsersActivityStatus,
	});

export const useUsersByOffice = () =>
	useQuery({
		queryKey: ["dashboard", "users", "by-office"],
		queryFn: fetchUsersByOffice,
	});

// TanStack Query hooks - Offices
export const useOfficesOverview = () =>
	useQuery({
		queryKey: ["dashboard", "offices", "overview"],
		queryFn: fetchOfficesOverview,
	});

export const useOfficesDetailedStats = () =>
	useQuery({
		queryKey: ["dashboard", "offices", "detailed-stats"],
		queryFn: fetchOfficesDetailedStats,
	});

// TanStack Query hook - Viewer Stats
export const useViewerStats = () =>
	useQuery({
		queryKey: ["dashboard", "viewer-stats"],
		queryFn: fetchViewerStats,
	});

// TanStack Query hook - Comprehensive
export const useComprehensiveDashboardData = () =>
	useQuery({
		queryKey: ["dashboard", "comprehensive"],
		queryFn: fetchComprehensiveDashboardData,
	});
