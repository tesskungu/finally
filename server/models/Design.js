import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Design",
    },
    settings: {
      fabric: String,
      mockup: String,
      scale: Number,
      rotation: Number,
      offsetX: Number,
      offsetY: Number,
      brightness: Number,
      contrast: Number,
      backgroundColor: String,
      productColor: String,
    },
    thumbnail: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Design = mongoose.model("Design", designSchema);

export default Design;
