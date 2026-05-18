// routes/searchRoute.ts
import express from "express";
import { searchCompanies } from "../controllers/searchController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, searchCompanies);

export default router;