import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
export const getOffices = async (req: Request, res: Response) => {
	try {
		const offices = await prisma.offices.findMany();
		res.status(200).json(offices);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};
