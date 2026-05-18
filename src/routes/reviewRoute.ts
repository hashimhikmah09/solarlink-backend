
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createReview, getCompanyReviews} from "../controllers/reviewController.js";



const router = express.Router();
router.use(authMiddleware);

// Create Review
router.post("/company/:id", createReview);

// Get Reviews for a Company
router.get("/company/:id", getCompanyReviews);
 

export default router;