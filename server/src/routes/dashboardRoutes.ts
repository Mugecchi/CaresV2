import express from "express";
import {
	getRecordsOverview,
	getRecordsByStatus,
	getRecordsByDocumentType,
	getRecordsBySponsor,
	getTopDownloadedRecords,
	getRecordsCreatedTimeline,
	getRecordsIssuedTimeline,
	getRecordsDateRangeDistribution,
	getUsersOverview,
	getUsersByRole,
	getUsersActivityStatus,
	getUsersByOffice,
	getOfficesOverview,
	getOfficesDetailedStats,
	getComprehensiveDashboardData,
	viewerStats,
} from "../controller/dashboardController";
import { protectRoute } from "../middleware/auth.middleware";

const dashboard = express.Router();

// All dashboard routes require authentication
dashboard.use(protectRoute);

// ============================================================================
// RECORDS ENDPOINTS
// ============================================================================

// Get records overview (KPI metrics)
dashboard.get("/records/overview", getRecordsOverview);

// Get records breakdown by status
dashboard.get("/records/by-status", getRecordsByStatus);

// Get records breakdown by document type
dashboard.get("/records/by-document-type", getRecordsByDocumentType);

// Get records breakdown by sponsor
dashboard.get("/records/by-sponsor", getRecordsBySponsor);

// Get top downloaded records
dashboard.get("/records/top-downloaded", getTopDownloadedRecords);

// Get records created timeline (useful for trend analysis)
dashboard.get("/records/timeline/created", getRecordsCreatedTimeline);

// Get records issued timeline (useful for publication trends)
dashboard.get("/records/timeline/issued", getRecordsIssuedTimeline);

// Get records date range distribution (7, 30, 90 days)
dashboard.get(
	"/records/date-range-distribution",
	getRecordsDateRangeDistribution,
);

// ============================================================================
// USER ENDPOINTS
// ============================================================================

// Get users overview (KPI metrics)
dashboard.get("/users/overview", getUsersOverview);

// Get users breakdown by role
dashboard.get("/users/by-role", getUsersByRole);

// Get users activity status (active/inactive)
dashboard.get("/users/activity-status", getUsersActivityStatus);

// Get users breakdown by office
dashboard.get("/users/by-office", getUsersByOffice);

// ============================================================================
// OFFICE ENDPOINTS
// ============================================================================

// Get offices overview (KPI metrics)
dashboard.get("/offices/overview", getOfficesOverview);

// Get detailed office statistics with user counts
dashboard.get("/offices/detailed-stats", getOfficesDetailedStats);

// ============================================================================
// COMPREHENSIVE DASHBOARD
// ============================================================================

// Get all dashboard data at once
dashboard.get("/comprehensive", getComprehensiveDashboardData);

// Get viewer statistics and trends
dashboard.get("/viewer-stats", viewerStats);

export default dashboard;
