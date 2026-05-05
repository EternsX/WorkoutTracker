import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false },
  ssl: false
});

// Test connection
const testConnection = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
};

testConnection();

// Simple query helper for non-transactional queries
export const query = (text, params) => pool.query(text, params);

// Helper to get a client for transactions
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};