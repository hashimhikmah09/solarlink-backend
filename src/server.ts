import express from "express";
import "dotenv/config";

import  { connectDB, disconnectDB } from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoute.js";
import companyRoutes from "./routes/companyRoutes.js";

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// HEALTH CHECK ROUTE
// ======================
app.get("/", (req, res) => {
  res.json({
    message: "API is running 🚀",
    status: "success",
  });
});

// ======================
// API ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);

// ======================
// ERROR HANDLING (404)
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ======================
// GLOBAL ERROR HANDLERS
// ======================

// Handle unhandled promise rejections
process.on("unhandledRejection", async (err) => {
  console.error("UNHANDLED REJECTION:", err);

  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);

  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");

  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});