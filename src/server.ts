import express from "express";
import "dotenv/config";
import { initializeSocket } from "./socket/socket.js";
import  { connectDB, disconnectDB } from "./config/db.js";
import http from "http";
import cors from "cors";


// Routes
import authRoutes from "./routes/authRoute.js";
import companyRoutes from "./routes/companyRoutes.js";
import quoteRoutes from "./routes/quoteRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";
import uploadRoutes from "./routes/uploadRoute.js";
import notificationRoutes from "./routes/notificationRoute.js";
import searchRoutes from "./routes/searchRoute.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoute from "./routes/messageRoute.js";


const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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
app.use("/auth", authRoutes);
app.use("/company", companyRoutes);
app.use("/quote", quoteRoutes);
app.use("/review", reviewRoutes);
app.use("/upload", uploadRoutes); // file upload route
app.use("/notifications", notificationRoutes); // notification routes
app.use("/search", searchRoutes); // search route
app.use("/conversations", conversationRoutes)//conversation routes
app.use("/messages", messageRoute) // message routes
// ======================
// ERROR HANDLING (404)
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const server = http.createServer(app);

initializeSocket(server);

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
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

export default app;