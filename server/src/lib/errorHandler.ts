import { ZodError } from "zod";
import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof ZodError) {
		return res
			.status(400)
			.json({ message: "Validation error", errors: err.issues });
	}

	if (
		err instanceof Prisma.PrismaClientKnownRequestError &&
		err.code === "P2002"
	) {
		return res.status(409).json({ message: "Duplicate entry" });
	}

	return res.status(500).json({ message: "Internal server error" });
};
export default errorHandler;
