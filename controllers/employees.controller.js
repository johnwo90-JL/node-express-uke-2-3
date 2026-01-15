import { Employee, User } from "../models/index.js";

export const getEmployees = async () => {
  try {
    const employees = await Employee.findAll({
      include: [{
        model: User,
        as: "userAccount",
        attributes: ["id", "email", "role"]
      }],
      order: [["lastname", "ASC"], ["firstname", "ASC"]]
    });
    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw new Error("Failed to fetch employees");
  }
};

export const getEmployeeById = async (id) => {
  try {
    const employee = await Employee.findByPk(id, {
      include: [{
        model: User,
        as: "userAccount",
        attributes: ["id", "email", "role"]
      }]
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error;
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const employee = await Employee.create(employeeData);
    return employee;
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      throw new Error(error.errors.map(e => e.message).join(", "));
    }
    console.error("Error creating employee:", error);
    throw new Error("Failed to create employee");
  }
};

export const updateEmployee = async (id, updateData) => {
  try {
    const employee = await Employee.findByPk(id);

    if (!employee) {
      throw new Error("Employee not found");
    }

    await employee.update(updateData);
    return employee;
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      throw new Error(error.errors.map(e => e.message).join(", "));
    }
    console.error("Error updating employee:", error);
    throw new Error("Failed to update employee");
  }
};

export const upsertEmployee = async (id, employeeData) => {
  try {
    const [employee, created] = await Employee.upsert({
      id,
      ...employeeData
    }, {
      returning: true
    });

    return {
      employee,
      created // true if inserted, false if updated
    };
  } catch (error) {
    console.error("Error upserting employee:", error);
    throw new Error("Failed to upsert employee");
  }
};

export const deleteEmployee = async (id) => {
  try {
    const employee = await Employee.findByPk(id);

    if (!employee) {
      throw new Error("Employee not found");
    }

    await employee.destroy();
    return { success: true, message: "Employee deleted successfully" };
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw new Error("Failed to delete employee");
  }
};