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
} from "../utils/generateToken.js";



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
    const accessToken = generateAccessToken({ id: user.id, res });

    // 🚫 Never return password
    const { password: _, ...safeUser } = user;

    return res.status(201).json({
        status: "success",
        data: safeUser,
        accessToken,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
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
    const accessToken = generateAccessToken({ id: user.id, res });

 // 🚫 Never return password
    const { password: _, ...safeUser } = user;

    return res.status(201).json({
        status: "success",
        data: safeUser,
        accessToken,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
