import express from "express";

import {
  sendMessage,
  getMessages,
} from "../controllers/messageController.js";

import {
  authMiddleware
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", sendMessage);

router.get( "/:conversationId",getMessages);

export default router;