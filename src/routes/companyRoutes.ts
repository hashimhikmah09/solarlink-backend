import express from "express";

import {
  getCompanies,
  getCompanyById,
  addProduct,
} from "../controllers/companyControllers.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET All Companies
 */
router.get("/", getCompanies);

/**
 * GET Single Company
 */
router.get("/:id", getCompanyById);

/**
 * POST Add Product
 * Private Route
 */
router.post(
  "/:id/products",
  protect,
  addProduct
);

export default router;