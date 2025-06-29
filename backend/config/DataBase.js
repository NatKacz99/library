import env from "dotenv";
import pg from "pg";

env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect()
  .then(() => console.log("✅ Connection with PostgreSQL"))
  .catch((err) => console.error("❌ Connection with database error:", err));

export default db;