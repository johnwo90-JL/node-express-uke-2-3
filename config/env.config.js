import dotenv from "dotenv";
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3500,

  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || "node_express_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    dialect: process.env.DB_DIALECT || "postgres",
    storage: process.env.DB_STORAGE // For SQLite
  },

  jwt: {
    secret: process.env.JWT_SECRET || "foobar12",
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || "3h",
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || "7d"
  },

  cors: {
    origins: process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:3500",
      "http://127.0.0.1:5500"
    ]
  }
};