import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test connection
pool.query("SELECT 1")
  .then(() => console.log("PostgreSQL connected"))
  .catch(err => console.error(err));

// Simple query helper for non-transactional queries
export const query = (text, params) => pool.query(text, params);

// Helper to get a client for transactions
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};