import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/db.config.js";
import User from "./user.model.js";
import RefreshToken from "./refresh-token.model.js";


const UserRefreshToken = sequelize.define("UserRefreshToken", {
  userId: {
    type: DataTypes.UUIDV4,
    references: {
      model: User,
      key: "id"
    }
  },
  refreshTokenId: {
    type: DataTypes.UUIDV4,
    references: {
      model: RefreshToken,
      key: "id"
    }
  }
}, {
  tableName: "activeRefreshTokens",
  timestamps: true,
});

RefreshToken.belongsTo(User, { through: "UserRefreshTokenFK" });

export default RefreshToken;