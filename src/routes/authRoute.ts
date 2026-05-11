import express from "express";

import {
  register,
  login,
  refresh,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * Register
 */
router.post("/register", register);

/**
 * Login
 */
router.post("/login", login);

/**
 * Refresh Access Token
 */
router.post("/refresh", refresh);

export default router;