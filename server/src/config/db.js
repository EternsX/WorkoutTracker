import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT 1")
  .then(() => console.log("PostgreSQL connected"))
  .catch(err => console.error(err));

export const query = (text, params) => pool.query(text, params);