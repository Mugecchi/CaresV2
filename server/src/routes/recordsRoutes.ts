import express from "express";
import {
	getRecords,
	getRecordStats,
	getRecordById,
} from "../controller/recordsController";
import { protectRoute } from "../middleware/auth.middleware";

const records = express.Router();

// Protected routes - require authentication
records.get("/", protectRoute, getRecords);
records.get("/stats", protectRoute, getRecordStats);
records.get("/:id", protectRoute, getRecordById);

export default records;
