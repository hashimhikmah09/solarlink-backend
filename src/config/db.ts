import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

export { prisma };

/**
 * Connect DB (Prisma doesn't require manual connect,
 * but we keep it for consistency/logging)
 */
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

/**
 * Disconnect DB safely
 */
export const disconnectDB = async () => {
  await prisma.$disconnect();
};