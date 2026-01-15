import sequelize from "../config/db.config.js";
import User from "./user.model.js";
import Employee from "./employee.model.js";

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