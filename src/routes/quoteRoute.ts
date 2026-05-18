import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createQuote, getQuotes, updateQuoteStatus } from "../controllers/quoteController.js";


const router = express.Router();
//PROTECT ALL ROUTES
router.use(authMiddleware);

// Create Quote
router.post("/", createQuote);

//GetQuotes
router.get("/", getQuotes);

//update quote status
router.patch("/:id", updateQuoteStatus);

export default router;