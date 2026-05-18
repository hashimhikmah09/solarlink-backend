import { createClient } from "redis";

export const redis = createClient();

export const connectRedis = async () => {
  try {
    await redis.connect();
    console.log("✅ Redis connected");
  } catch (error) {
    console.log("⚠️ Redis not available, continuing without cache");
  }
};