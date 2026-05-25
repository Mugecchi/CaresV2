import express, { Request, Response } from "express";
import {
	checkAuth,
	logout,
	signIn,
	signUp,
} from "../controller/authController";
import { protectRoute } from "../middleware/auth.middleware";

const auth = express.Router();

auth.post("/signup", signUp);
auth.post("/signin", signIn);
auth.post("/logout", logout);
auth.get("/check", protectRoute, checkAuth);
export default auth;
