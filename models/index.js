import sequelize from "../config/database.js";
import User from "./User.js";
import Employee from "./Employee.js";

// Define associations
User.hasOne(Employee, {
  foreignKey: "userId",
  as: "employeeProfile"
});

Employee.belongsTo(User, {
  foreignKey: "userId",
  as: "userAccount"
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