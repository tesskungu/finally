import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Design = sequelize.define(
  "Design",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "Untitled Design",
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    thumbnail: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
  },
  {
    timestamps: true,
    tableName: "designs",
  }
);

Design.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Design, { foreignKey: "userId" });

export default Design;
