import bcrypt from "bcrypt";
import { Request, response, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { generateToken } from "../lib/utils";
const signupSchema = z.object({
	name: z.string(),
	email: z.email(),
	password: z.string().min(6),
	office: z.string().optional(),
});

export const signUp = async (req: Request, res: Response) => {
	const userCred = signupSchema.parse(req.body);
	try {
		const hashedPassword = await bcrypt.hash(userCred.password, 10);

		const newUser = await prisma.users.create({
			data: {
				name: userCred.name,
				email: userCred.email,
				office_id: userCred.office,
				password: hashedPassword,
				role: Role.USER,
			},
		});

		res.status(201).json({
			message: "User created successfully",
			user: { ...newUser, password: undefined },
		});
	} catch (error: any) {
		console.error("Error during sign up:", error);

		// Handle unique constraint violation (email already exists)
		if (error.code === "P2002") {
			return res.status(409).json({ message: "Email already exists" });
		}

		res.status(500).json({ message: "Internal server error" });
	}
};

export const signIn = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	try {
		// Validate input
		if (!email || !password) {
			return res.status(400).json({ message: "Email and password required" });
		}

		const user = await prisma.users.findUnique({ where: { email } });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.isActive === false) {
			return res.status(403).json({ message: "Account is deactivated" });
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		generateToken(user.id, res);

		res.status(200).json({
			message: "Sign in successful",
			user: { ...user, password: undefined },
		});
	} catch (error) {
		console.error("Error during sign in:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const logout = (req: Request, res: Response) => {
	res.cookie("jwt", "", { maxAge: 0 });
	res.status(200).json({ message: "Logged out successfully" });
};

export const checkAuth = async (req: Request, res: Response) => {
	// protectRoute middleware already verified JWT and attached user
	if (!req.user) return res.status(401).json({ error: "Not authenticated" });
	res.json({ user: req.user });
};
