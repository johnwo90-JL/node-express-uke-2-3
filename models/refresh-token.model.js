import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/db.config.js";
import User from "./user.model.js";


const RefreshToken = sequelize.define("RefreshToken", {
  userId: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    unique: true,

  },
}, {
  tableName: "activeRefreshTokens",
  timestamps: true,
});



export default RefreshToken;