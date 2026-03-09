import express from "express";
import jwt from "jsonwebtoken";
import Design from "../models/Design.js";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware to verify token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Save a new design
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, settings, thumbnail } = req.body;

    const design = new Design({
      userId: req.userId,
      name: name || "Untitled Design",
      settings,
      thumbnail: thumbnail || "",
    });

    await design.save();

    res.status(201).json({
      message: "Design saved successfully",
      design,
    });
  } catch (error) {
    console.error("Save design error:", error);
    res.status(500).json({ message: "Server error saving design" });
  }
});

// Get all designs for current user
router.get("/", authenticate, async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("name settings thumbnail createdAt");

    res.json({ designs });
  } catch (error) {
    console.error("Get designs error:", error);
    res.status(500).json({ message: "Server error fetching designs" });
  }
});

// Get a single design
router.get("/:id", authenticate, async (req, res) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    res.json({ design });
  } catch (error) {
    console.error("Get design error:", error);
    res.status(500).json({ message: "Server error fetching design" });
  }
});

// Update a design
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { name, settings, thumbnail } = req.body;

    const design = await Design.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, settings, thumbnail },
      { new: true },
    );

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    res.json({
      message: "Design updated successfully",
      design,
    });
  } catch (error) {
    console.error("Update design error:", error);
    res.status(500).json({ message: "Server error updating design" });
  }
});

// Delete a design
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const design = await Design.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    res.json({ message: "Design deleted successfully" });
  } catch (error) {
    console.error("Delete design error:", error);
    res.status(500).json({ message: "Server error deleting design" });
  }
});

export default router;
