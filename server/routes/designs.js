import express from "express";
import jwt from "jsonwebtoken";
import Design from "../models/Design.js";

const router = express.Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

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

    const design = await Design.create({
      userId: req.userId,
      name: name || "Untitled Design",
      settings,
      thumbnail: thumbnail || "",
    });

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
    const designs = await Design.findAll({
      where: { userId: req.userId },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name", "settings", "thumbnail", "createdAt"],
    });

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
      where: {
        id: req.params.id,
        userId: req.userId,
      },
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

    const design = await Design.findOne({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    design.name = name !== undefined ? name : design.name;
    design.settings = settings !== undefined ? settings : design.settings;
    design.thumbnail = thumbnail !== undefined ? thumbnail : design.thumbnail;

    await design.save();

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
    const design = await Design.findOne({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    await design.destroy();

    res.json({ message: "Design deleted successfully" });
  } catch (error) {
    console.error("Delete design error:", error);
    res.status(500).json({ message: "Server error deleting design" });
  }
});

export default router;