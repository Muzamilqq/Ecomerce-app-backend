import pkg from "pg";
const { Client } = pkg;
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const database = new Client({
  user: process.env.DB_USER, // e.g., "postgres"
  host: process.env.DB_HOST, // e.g., "db.cduapyvabihbfjtdzfln.supabase.co"
  database: process.env.DB_NAME, // e.g., "postgres"
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

try {
  await database.connect();
  console.log("Connected to the remote database successfully!");
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

export default database;
