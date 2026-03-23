import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

const database = new Client({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false },
});

await database.connect();
console.log("Connected!");
export default database;
