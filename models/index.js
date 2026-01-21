import sequelize from "../config/db.config.js";
import User from "./user.model.js";
import Employee from "./employee.model.js";
import RefreshToken from "./refresh-token.model.js";

// Define associations
User.hasOne(Employee, {
  foreignKey: "userId",
  as: "employeeProfile"
});

Employee.belongsTo(User, {
  foreignKey: "userId",
  as: "userAccount"
});

RefreshToken.belongsTo(User, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  constraints: true,
})

User.hasOne(RefreshToken, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  constraints: true,
});

// Export models and sequelize instance
export {
  sequelize,
  User,
  Employee
};

export default {
  sequelize,
  User,
  Employee
};