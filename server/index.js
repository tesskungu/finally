import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import designRoutes from "./routes/designs.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://fabviz:fab1234@cluster0.n92vv7o.mongodb.net/?appName=Cluster0";

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

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Start server anyway for demo purposes
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without MongoDB)`);
    });
  });

export default app;
