import { User } from "../models/index.js";
import { UserSchemaCreate } from "../schema/user.schema.js";

export const getUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] } // Never return passwords
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const validatedData = userSchema.parse(userData);
    const user = await User.create(validatedData);

    return user.toJSON();
  } catch (error) {
    switch(error.name) {
        case "SequelizeValidationError":
            throw new Error("Email already exists");
        case "SequelizeUniqueConstraintError":
            throw new Error(error.errors.map(e => e.message).join(", "));
        default:
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
    }
  }
};

export const updateUser = async (id, updateData) => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    // Update user (password will be auto-hashed if changed)
    await user.update(updateData);

    return user.toJSON();
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      throw new Error(error.errors.map(e => e.message).join(", "));
    }
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

export const deleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    await user.destroy();

    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};