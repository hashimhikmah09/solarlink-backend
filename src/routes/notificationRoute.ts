// src/routes/notificationRoutes.ts

import express from "express";

import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);

router.patch("/:id/read", markNotificationAsRead);

export default router;