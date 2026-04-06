import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth.js";
import designRoutes from "./routes/designs.js";
import { verifyEmailConfig } from "./utils/email.js";
import sequelize from "./config/database.js";
import User from "./models/User.js";
import Design from "./models/Design.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Connect to PostgreSQL and start server
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");

    // Sync models (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log("✅ Database models synchronized");

    // Verify email configuration
    await verifyEmailConfig();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}

// Initialize and start server
startServer();

export default app;
