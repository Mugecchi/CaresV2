import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * DASHBOARD CONTROLLER
 * Exposes all data points for visualization across the application
 * Each endpoint includes recommended chart types for optimal data presentation
 */

// ============================================================================
// RECORDS METRICS
// ============================================================================

/**
 * Get total records count and basic statistics
 * BEST FOR: KPI Cards / Number Cards
 * Use to display key metrics in a dashboard header or overview section
 */
export const getRecordsOverview = async (req: Request, res: Response) => {
	try {
		const whereNotDeleted = { is_deleted: { not: "true" } };

		const [totalRecords, deletedRecords, activeRecords] = await Promise.all([
			prisma.records.count({ where: whereNotDeleted }),
			prisma.records.count({ where: { is_deleted: "true" } }),
			prisma.records.count({ where: { ...whereNotDeleted, status: "active" } }),
		]);

		res.json({
			totalRecords,
			deletedRecords,
			activeRecords,
			inactiveRecords: totalRecords - activeRecords,
		});
	} catch (error) {
		console.error("Error fetching records overview:", error);
		res.status(500).json({ message: "Failed to fetch records overview" });
	}
};

/**
 * Get records breakdown by status
 * BEST FOR: Pie Chart / Donut Chart / Bar Chart
 * Use pie/donut for showing proportions, bar chart for comparing exact counts
 */
export const getRecordsByStatus = async (req: Request, res: Response) => {
	try {
		const whereNotDeleted = { is_deleted: { not: "true" } };

		const statusBreakdown = await prisma.records.groupBy({
			by: ["status"],
			where: whereNotDeleted,
			_count: true,
		});

		const data = statusBreakdown.map((item) => ({
			status: item.status || "Unknown",
			count: item._count,
		}));

		res.json(data);
	} catch (error) {
		console.error("Error fetching records by status:", error);
		res.status(500).json({ message: "Failed to fetch records by status" });
	}
};

/**
 * Get records breakdown by document type
 * BEST FOR: Pie Chart / Donut Chart / Horizontal Bar Chart
 * Use to visualize distribution of different document types
 */
export const getRecordsByDocumentType = async (req: Request, res: Response) => {
	try {
		const whereNotDeleted = { is_deleted: { not: "true" } };

		const documentTypeBreakdown = await prisma.records.groupBy({
			by: ["document_type"],
			where: whereNotDeleted,
			_count: true,
		});

		const data = documentTypeBreakdown.map((item) => ({
			documentType: item.document_type || "Unknown",
			count: item._count,
		}));

		res.json(data);
	} catch (error) {
		console.error("Error fetching records by document type:", error);
		res
			.status(500)
			.json({ message: "Failed to fetch records by document type" });
	}
};

/**
 * Get records breakdown by sponsor
 * BEST FOR: Horizontal Bar Chart / Vertical Bar Chart
 * Use to compare sponsor contribution/volume
 */
export const getRecordsBySponsor = async (req: Request, res: Response) => {
	try {
		const whereNotDeleted = { is_deleted: { not: "true" } };

		const sponsorBreakdown = await prisma.records.groupBy({
			by: ["sponsor"],
			where: whereNotDeleted,
			_count: true,
		});

		const data = sponsorBreakdown
			.map((item) => ({
				sponsor: item.sponsor || "Unknown",
				count: item._count,
			}))
			.sort((a, b) => b.count - a.count);

		res.json(data);
	} catch (error) {
		console.error("Error fetching records by sponsor:", error);
		res.status(500).json({ message: "Failed to fetch records by sponsor" });
	}
};

/**
 * Get top downloaded records
 * BEST FOR: Horizontal Bar Chart / Table
 * Use to display most accessed/downloaded records
 */
export const getTopDownloadedRecords = async (req: Request, res: Response) => {
	try {
		const { limit = 10 } = req.query;
		const limitNum = parseInt(limit as string) || 10;
		const whereNotDeleted = { is_deleted: { not: "true" } };

		const topRecords = await prisma.records.findMany({
			where: whereNotDeleted,
			select: {
				id: true,
				number: true,
				download_count: true,
			},
			orderBy: {
				download_count: "desc",
			},
			take: limitNum,
		});

		const data = topRecords.map((record) => ({
			title: record.number,
			downloadCount: record.download_count || 0,
		}));

		res.json(data);
	} catch (error) {
		console.error("Error fetching top downloaded records:", error);
		res.status(500).json({ message: "Failed to fetch top downloaded records" });
	}
};

/**
 * Get records created timeline (by month)
 * BEST FOR: Line Chart / Area Chart / Column Chart
 * Use to visualize record creation trends over time
 */
export const getRecordsCreatedTimeline = async (
	req: Request,
	res: Response,
) => {
	try {
		const whereNotDeleted = { is_deleted: { not: "true" } };

		const records = await prisma.records.findMany({
			where: whereNotDeleted,
			select: {
				created_at: true,
				document_type: true,
			},
		});

		// Group by month and document type
		const timeline: {
			[month: string]: { [docType: string]: number };
		} = {};
		records.forEach((record) => {
			if (record.created_at) {
				const monthKey = record.created_at.toISOString().slice(0, 7); // YYYY-MM format
				const docType = record.document_type || "Unknown";

				if (!timeline[monthKey]) {
					timeline[monthKey] = {};
				}
				timeline[monthKey][docType] = (timeline[monthKey][docType] || 0) + 1;
			}
		});

		const data = Object.entries(timeline)
			.sort((a, b) => a[0].localeCompare(b[0]))
			.slice(60)
			.map(([month, docTypeCounts]) => ({
				month,
				...docTypeCounts,
			}));

		res.json(data);
	} catch (error) {
		console.error("Error fetching records created timeline:", error);
		res
			.status(500)
			.json({ message: "Failed to fetch records created timeline" });
	}
};

/**
 * Get records issued timeline (by month)
 * BEST FOR: Line Chart / Area Chart / Column Chart
 * Use to visualize when records were officially issued
 */
export const getRecordsIssuedTimeline = async (req: Request, res: Response) => {
	try {
		const whereNotDeleted = { is_deleted: { not: "true" } };

		const records = await prisma.records.findMany({
			where: whereNotDeleted,
			select: {
				created_at: true,
			},
		});

		// Group by month
		const timeline: { [key: string]: number } = {};
		records.forEach((record) => {
			if (record.created_at) {
				const date = record.created_at.toISOString().slice(0, 7); // YYYY-MM format
				timeline[date] = (timeline[date] || 0) + 1;
			}
		});

		const data = Object.entries(timeline)
			.sort((a, b) => a[0].localeCompare(b[0]))
			.slice(-36)
			.map(([month, count]) => ({
				month,
				count,
			}));

		res.json(data);
	} catch (error) {
		console.error("Error fetching records issued timeline:", error);
		res
			.status(500)
			.json({ message: "Failed to fetch records issued timeline" });
	}
};

/**
 * Get records distribution by creation date range
 * BEST FOR: Gauge Chart / Progress Bar (for period comparison)
 * Use to show how many records were created in last 7, 30, 90 days
 */
export const getRecordsDateRangeDistribution = async (
	req: Request,
	res: Response,
) => {
	try {
		const whereNotDeleted = { is_deleted: { not: "true" } };
		const now = new Date();

		const daysAgo = (d: number) =>
			new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

		const sevenDaysAgo = daysAgo(7);
		const thirtyDaysAgo = daysAgo(30);
		const ninetyDaysAgo = daysAgo(90);
		const [last7Days, last30Days, last90Days, allTime] = await Promise.all([
			prisma.records.groupBy({
				by: ["document_type"],
				where: {
					...whereNotDeleted,
					created_at: { gte: sevenDaysAgo },
				},
				_count: { _all: true },
			}),

			prisma.records.groupBy({
				by: ["document_type"],
				where: {
					...whereNotDeleted,
					created_at: { gte: thirtyDaysAgo },
				},
				_count: { _all: true },
			}),
			prisma.records.groupBy({
				by: ["document_type"],
				where: {
					...whereNotDeleted,
					created_at: { gte: ninetyDaysAgo },
				},
				_count: { _all: true },
			}),
			prisma.records.groupBy({
				by: ["document_type"],
				where: whereNotDeleted,
				_count: { _all: true },
			}),
		]);

		// Transform into stacked chart format
		const transformData = (
			data: Array<{ document_type: string | null; _count: { _all: number } }>,
		) => {
			const result: { [key: string]: number } = {};
			data.forEach((item) => {
				const docType = item.document_type || "Unknown";
				result[docType] = item._count._all;
			});
			return result;
		};

		const stackedData = [
			{ range: "Last 7 Days", ...transformData(last7Days) },
			{ range: "Last 30 Days", ...transformData(last30Days) },
			{ range: "Last 90 Days", ...transformData(last90Days) },
		];

		res.json(stackedData);
	} catch (error) {
		console.error("Error fetching records date range distribution:", error);
		res.status(500).json({
			message: "Failed to fetch records date range distribution",
		});
	}
};

// ============================================================================
// USER METRICS
// ============================================================================

/**
 * Get total users count and basic statistics
 * BEST FOR: KPI Cards / Number Cards
 */
export const getUsersOverview = async (req: Request, res: Response) => {
	try {
		const [totalUsers, activeUsers, inactiveUsers] = await Promise.all([
			prisma.users.count({ where: { role: { not: "ADMIN" } } }),
			prisma.users.count({ where: { isActive: true, role: { not: "ADMIN" } } }),
			prisma.users.count({
				where: { isActive: false, role: { not: "ADMIN" } },
			}),
		]);

		res.json({
			totalUsers,
			activeUsers,
			inactiveUsers,
		});
	} catch (error) {
		console.error("Error fetching users overview:", error);
		res.status(500).json({ message: "Failed to fetch users overview" });
	}
};

/**
 * Get users breakdown by role
 * BEST FOR: Pie Chart / Donut Chart / Bar Chart
 * Use to visualize user distribution across different roles
 */
export const getUsersByRole = async (req: Request, res: Response) => {
	try {
		const roleBreakdown = await prisma.users.groupBy({
			by: ["role"],
			where: { role: { not: "ADMIN" } },
			_count: true,
		});

		const data = roleBreakdown.map((item) => ({
			role: item.role || "USER",
			count: item._count,
		}));

		res.json(data);
	} catch (error) {
		console.error("Error fetching users by role:", error);
		res.status(500).json({ message: "Failed to fetch users by role" });
	}
};

/**
 * Get users active vs inactive breakdown
 * BEST FOR: Pie Chart / Donut Chart / Ring Chart
 * Use to visualize user account status distribution
 */
export const getUsersActivityStatus = async (req: Request, res: Response) => {
	try {
		const [activeUsers, inactiveUsers] = await Promise.all([
			prisma.users.count({ where: { isActive: true, role: { not: "ADMIN" } } }),
			prisma.users.count({
				where: { isActive: false, role: { not: "ADMIN" } },
			}),
		]);

		res.json({
			active: {
				label: "Active",
				count: activeUsers,
			},
			inactive: {
				label: "Inactive",
				count: inactiveUsers,
			},
		});
	} catch (error) {
		console.error("Error fetching users activity status:", error);
		res.status(500).json({ message: "Failed to fetch users activity status" });
	}
};

/**
 * Get users breakdown by office
 * BEST FOR: Horizontal Bar Chart / Vertical Bar Chart
 * Use to compare user distribution across offices
 */
export const getUsersByOffice = async (req: Request, res: Response) => {
	try {
		const officesWithUsers = await prisma.offices.findMany({
			include: {
				Users: {
					where: { role: { not: "ADMIN" } },
				},
			},
		});

		const data = officesWithUsers.map((office) => ({
			officeId: office.id,
			officeName: office.name || "Unknown",
			userCount: office.Users.length,
		}));

		res.json(data);
	} catch (error) {
		console.error("Error fetching users by office:", error);
		res.status(500).json({ message: "Failed to fetch users by office" });
	}
};

// ============================================================================
// OFFICE METRICS
// ============================================================================

/**
 * Get total offices count and basic statistics
 * BEST FOR: KPI Cards / Number Cards
 */
export const getOfficesOverview = async (req: Request, res: Response) => {
	try {
		const totalOffices = await prisma.offices.count();

		const officeStats = await prisma.offices.findMany({
			include: {
				Users: {
					where: { role: { not: "ADMIN" } },
				},
			},
		});

		const avgUsersPerOffice =
			officeStats.length > 0
				? officeStats.reduce((sum, office) => sum + office.Users.length, 0) /
					officeStats.length
				: 0;

		res.json({
			totalOffices,
			averageUsersPerOffice: Math.round(avgUsersPerOffice * 100) / 100,
		});
	} catch (error) {
		console.error("Error fetching offices overview:", error);
		res.status(500).json({ message: "Failed to fetch offices overview" });
	}
};

/**
 * Get detailed office statistics with user counts
 * BEST FOR: Table / Horizontal Bar Chart
 * Use to see comprehensive office data with associated metrics
 */
export const getOfficesDetailedStats = async (req: Request, res: Response) => {
	try {
		const officeStats = await prisma.offices.findMany({
			include: {
				Users: {
					where: { role: { not: "ADMIN" } },
				},
			},
		});

		const data = officeStats
			.map((office) => ({
				officeId: office.id,
				officeName: office.name || "Unknown",
				userCount: office.Users.length,
			}))
			.sort((a, b) => b.userCount - a.userCount);

		res.json(data);
	} catch (error) {
		console.error("Error fetching offices detailed stats:", error);
		res.status(500).json({ message: "Failed to fetch offices detailed stats" });
	}
};

// ============================================================================
// COMPREHENSIVE DASHBOARD DATA
// ============================================================================

/**
 * Get comprehensive dashboard data combining all key metrics
 * BEST FOR: Complete dashboard view / snapshot
 * Returns KPIs and summary data for all major areas
 */
export const getComprehensiveDashboardData = async (
	req: Request,
	res: Response,
) => {
	try {
		const whereNotDeleted = { is_deleted: { not: "true" } };

		const [
			recordsOverview,
			usersOverview,
			officesOverview,
			statusBreakdown,
			documentTypeBreakdown,
			usersByRole,
			userActivityStatus,
		] = await Promise.all([
			// Records metrics
			Promise.all([
				prisma.records.count({ where: whereNotDeleted }),
				prisma.records.count({ where: { is_deleted: "true" } }),
			]),
			// Users metrics
			Promise.all([
				prisma.users.count({ where: { role: { not: "ADMIN" } } }),
				prisma.users.count({
					where: { isActive: true, role: { not: "ADMIN" } },
				}),
				prisma.users.count({
					where: { isActive: false, role: { not: "ADMIN" } },
				}),
			]),
			// Offices metrics
			prisma.offices.count(),
			// Record status breakdown
			prisma.records.groupBy({
				by: ["status"],
				where: whereNotDeleted,
				_count: true,
			}),
			// Record document type breakdown
			prisma.records.groupBy({
				by: ["document_type"],
				where: whereNotDeleted,
				_count: true,
			}),
			// Users by role
			prisma.users.groupBy({
				by: ["role"],
				_count: true,
			}),
			// Users activity status
			Promise.all([
				prisma.users.count({ where: { isActive: true } }),
				prisma.users.count({ where: { isActive: false } }),
			]),
		]);

		res.json({
			records: {
				total: recordsOverview[0],
				deleted: recordsOverview[1],
				statusBreakdown: statusBreakdown.map((item) => ({
					status: item.status || "Unknown",
					count: item._count,
				})),
				documentTypeBreakdown: documentTypeBreakdown.map((item) => ({
					documentType: item.document_type || "Unknown",
					count: item._count,
				})),
			},
			users: {
				total: usersOverview[0],
				active: usersOverview[1],
				inactive: usersOverview[2],
				byRole: usersByRole.map((item) => ({
					role: item.role || "USER",
					count: item._count,
				})),
			},
			offices: {
				total: officesOverview,
			},
			generatedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error fetching comprehensive dashboard data:", error);
		res.status(500).json({
			message: "Failed to fetch comprehensive dashboard data",
		});
	}
};

export const viewerStats = async (req: Request, res: Response) => {
	try {
		const viewerData = await prisma.viewers.findMany({
			orderBy: { timestamp: "desc" },
		});

		// Group viewers by month for trend chart
		const viewersByDate: { [key: string]: number } = {};

		viewerData.forEach((viewer) => {
			const date = new Date(viewer.timestamp);
			const dateKey = date.toISOString().slice(0, 7); // YYYY-MM format

			if (!viewersByDate[dateKey]) {
				viewersByDate[dateKey] = 0;
			}
			viewersByDate[dateKey]++;
		});

		// Convert to array and sort by date
		const trendData = Object.entries(viewersByDate)
			.map(([date, count]) => ({
				date,
				count,
			}))
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

		// Get unique visitors by IP (approximate)
		const uniqueIPs = new Set(viewerData.map((v) => v.ip_address));
		const uniqueUserAgents = new Set(viewerData.map((v) => v.user_agent));

		res.json({
			totalViewers: viewerData.length,
			uniqueIPs: uniqueIPs.size,
			uniqueUserAgents: uniqueUserAgents.size,
			trend: trendData,
			recentViewers: viewerData.slice(0, 10).map((v) => ({
				id: v.id.toString(), // Convert BigInt to string
				ip_address: v.ip_address,
				user_agent: v.user_agent,
				timestamp: v.timestamp,
			})),
		});
	} catch (error) {
		console.error("Error fetching viewer stats:", error);
		res.status(500).json({ message: "Failed to fetch viewer stats" });
	}
};
