// 1. ALWAYS load environment variables first!
import "dotenv/config"; 

// 2. Standard imports
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 3. Setup the PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 4. Bind the PG driver adapter to Prisma Client
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };

/**
 * Connect DB (Prisma 7 driver adapters manage their own pools, 
 * but checking a client query ensures a valid connection)
 */
export const connectDB = async () => {
  try {
    // Using a raw query check instead of $connect is more reliable 
    // when using driver adapters like PrismaPg
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connected successfully via Driver Adapter");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

/**
 * Disconnect DB safely by closing the Prisma Client and the PG Pool
 */
export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    await pool.end(); // Cleanly close the underlying PG pool connections
    console.log("👋 Database disconnected cleanly");
  } catch (error) {
    console.error("❌ Error while disconnecting database:", error);
  }
};