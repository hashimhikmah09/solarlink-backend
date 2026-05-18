// src/controllers/notificationController.ts

import type { Request, Response } from "express";
import { prisma } from "../config/db.js";

export const getNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.id,
        isRead: false,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

//mark notification as read
export const markNotificationAsRead = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const notificationId = req.params.id;

    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
      },

      data: {
        isRead: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};

