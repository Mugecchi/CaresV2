import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getRecords = async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 10, status, documentType, search } = req.query;
		const pageNum = parseInt(page as string) || 1;
		const limitNum = parseInt(limit as string) || 10;
		const skip = (pageNum - 1) * limitNum;

		// Normalize query params to strings (handle array case)
		const statusStr = Array.isArray(status) ? status[0] : (status as string);
		const documentTypeStr = Array.isArray(documentType)
			? documentType[0]
			: (documentType as string);
		const searchStr = Array.isArray(search) ? search[0] : (search as string);

		// Build filter
		const where: any = { is_deleted: { not: "true" } };
		if (statusStr) where.status = statusStr;
		if (documentTypeStr) where.document_type = documentTypeStr;
		if (searchStr) {
			where.OR = [
				{ title: { contains: searchStr, mode: "insensitive" } },
				{ number: { contains: searchStr, mode: "insensitive" } },
				{ sponsor: { contains: searchStr, mode: "insensitive" } },
			];
		}

		const [records, total] = await Promise.all([
			prisma.records.findMany({
				where,
				skip,
				take: limitNum,
				orderBy: { date_issued: "desc" },
			}),
			prisma.records.count({ where }),
		]);

		res.json({
			records,
			pagination: {
				page: pageNum,
				limit: limitNum,
				total,
				pages: Math.ceil(total / limitNum),
			},
		});
	} catch (error) {
		console.error("Error fetching records:", error);
		res.status(500).json({ message: "Failed to fetch records" });
	}
};

export const getRecordStats = async (req: Request, res: Response) => {
	try {
		const whereNotDeleted = { is_deleted: { not: "true" } };

		const [totalRecords, statusBreakdown, documentTypeBreakdown] =
			await Promise.all([
				prisma.records.count({ where: whereNotDeleted }),
				prisma.records.groupBy({
					by: ["status"],
					where: whereNotDeleted,
					_count: true,
				}),
				prisma.records.groupBy({
					by: ["document_type"],
					where: whereNotDeleted,
					_count: true,
				}),
			]);

		res.json({
			totalRecords,
			statusBreakdown: statusBreakdown.map((item) => ({
				status: item.status || "Unknown",
				count: item._count,
			})),
			documentTypeBreakdown: documentTypeBreakdown.map((item) => ({
				documentType: item.document_type || "Unknown",
				count: item._count,
			})),
		});
	} catch (error) {
		console.error("Error fetching stats:", error);
		res.status(500).json({ message: "Failed to fetch statistics" });
	}
};

export const getRecordById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const idStr = Array.isArray(id) ? id[0] : (id as string);
		const record = await prisma.records.findUnique({
			where: { id: parseInt(idStr) },
		});

		if (!record || record.is_deleted === "true") {
			return res.status(404).json({ message: "Record not found" });
		}

		res.json(record);
	} catch (error) {
		console.error("Error fetching record:", error);
		res.status(500).json({ message: "Failed to fetch record" });
	}
};
