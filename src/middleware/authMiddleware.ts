import jwt from "jsonwebtoken";

import type { Request, Response, NextFunction } from "express";

import { prisma } from "../config/db.js"; 


/**
 * Protect Routes Middleware
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    let token: string | undefined;

    // Check Authorization Header
    const authHeader = req.headers.authorization;
    // console.log("Authorization header:", authHeader);
    if (
      authHeader &&
      authHeader.startsWith("Bearer")
    ) {

      token = authHeader.split(" ")[1];
      // console.log("Token extracted from header:", token);
      
    }

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {

      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;

    next();

  } catch (error) {

    res.status(401).json({
      success: false,
      message: "Invalid token: " + (error instanceof Error ? error.message : "Unknown error"),
    });
  }
};