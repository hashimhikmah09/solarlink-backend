import express from "express";

import {
  createConversation,
  getUserConversations,
} from "../controllers/conversationController.js";

import {
  authMiddleware
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createConversation);

router.get("/", getUserConversations);

export default router;