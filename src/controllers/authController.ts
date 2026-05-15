import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

// 1. IMPORT YOUR CONFIGURED CLIENT INSTANCE (Adjust path if needed)
import { prisma } from "../config/db.js"; 

import {
  registerSchema,
  loginSchema,
} from "../validations/authValidations.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

// ❌ REMOVED: const prisma = new PrismaClient(undefined as any);

/**
 * ==========================================
 * REGISTER USER
 * POST /api/auth/register
 * ==========================================
 */
export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    const { name, email, password, role } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as any,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.errors?.[0]?.message || "Invalid input",
    });
  }
};

/**
 * ==========================================
 * LOGIN USER
 * POST /api/auth/login
 * ==========================================
 */
export const login = async (req: Request, res: Response) => {
  try {
    // Validate request
    const validatedData = loginSchema.parse(req.body);

    const { email, password } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.errors?.[0]?.message || "Invalid input",
    });
  }
};

/**
 * ==========================================
 * REFRESH TOKEN
 * POST /api/auth/refresh
 * ==========================================
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { id: string };

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        refreshToken: true,
      },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user.id);

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};