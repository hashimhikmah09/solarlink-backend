import jwt from "jsonwebtoken";

import type { Request, Response, NextFunction } from "express";

import { prisma } from "../config/db.js"; 


/**
 * Protect Routes Middleware
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    let token: string | undefined;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token =
        req.headers.authorization.split(" ")[1];
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
      message: "Invalid token",
    });
  }
};