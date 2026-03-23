import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
import { Client } from "pg"; // PostgreSQL client

// Debug to make sure env is loading
console.log("DB_PASSWORD =", process.env.DB_PASSWORD);
const database = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

try {
  await database.connect();
  console.log("Connected to the database successfully");
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

export default database;
