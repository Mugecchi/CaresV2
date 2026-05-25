import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { ENV } from "../lib/ENV";
import { NextFunction, Request, Response } from "express";
import { Users } from "../../generated/prisma/browser";

// Extend Express Request to include user property
declare global {
	namespace Express {
		interface Request {
			user?: Users;
		}
	}
}

export const protectRoute = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.cookies.jwt;
		if (!token) return res.status(401).json({ message: "Unauthorized Access" });

		if (!ENV.JWT_SECRET) {
			return res.status(500).json({ message: "JWT_SECRET not configured" });
		}

		const decoded = jwt.verify(token, ENV.JWT_SECRET) as { userId: string };
		if (!decoded)
			return res.status(401).json({ message: "Unauthorized - Token Invalid" });

		const user = await prisma.users.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				office_id: true,
				office: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});
		if (!user) return res.status(404).json({ message: "User not Found" });

		req.user = user;
		next();
	} catch (error) {
		console.log("Error in protectRoute middleware", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// export const authorize = (...roles) => {
// 	return (req, res, next) => {
// 		if (!req.user) {
// 			return res.status(401).json({ message: "Unauthorized Access" });
// 		}

// 		if (!roles.includes(req.user.role)) {
// 			return res.status(403).json({
// 				message:
// 					"Forbidden - You don't have permission to access this resource",
// 			});
// 		}
// 		next();
// 	};
// };

// // Original protectRoute
// export const originalProtectRoute = async (req, res, next) => {
// 	try {
// 		const token = req.cookies.jwt;
// 		if (!token)
// 			return res
// 				.status(401)
// 				.json({ message: "Unauthorized - No token provided" });

// 		const decoded = jwt.verify(token, ENV.JWT_SECRET);
// 		if (!decoded)
// 			return res.status(401).json({ message: "Unauthorized - Invalid token" });

// 		const user = await User.findById(decoded.userId).select("-password");
// 		if (!user) return res.status(404).json({ message: "User not found" });

// 		req.user = user;
// 		next();
// 	} catch (error) {
// 		console.log("Error in protectRoute middleware:", error);
// 		res.status(500).json({ message: "Internal server error" });
// 	}
// };
