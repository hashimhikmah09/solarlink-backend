// src/utils/createNotification.ts

import { prisma } from "../config/db.js";

export const createNotification = async ({
  userId,
  title,
  message,
  type,
}: {
  userId: string;
  title: string;
  message: string;
  type: "QUOTE_UPDATE" | "NEW_MESSAGE" | "REVIEW_RECEIVED";
}) => {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  });
};