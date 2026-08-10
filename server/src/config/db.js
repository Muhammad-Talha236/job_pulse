// backend/src/config/db.js

import pg from "pg";

const { Pool } = pg;

/*
 * ---------------------------------------------------------
 * PostgreSQL Connection Pool
 * ---------------------------------------------------------
 *
 * Pool manages reusable database connections for us.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/*
 * ---------------------------------------------------------
 * Database Error Listener
 * ---------------------------------------------------------
 *
 * This catches unexpected errors from idle clients.
 */
pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

/*
 * ---------------------------------------------------------
 * Test Database Connection
 * ---------------------------------------------------------
 */
export const connectDatabase = async () => {
  try {
    const client = await pool.connect();

    console.log("PostgreSQL connected successfully");

    client.release();
  } catch (error) {
    console.error("PostgreSQL connection failed:", error.message);

    throw error;
  }
};

/*
 * ---------------------------------------------------------
 * Export Pool
 * ---------------------------------------------------------
 *
 * Other parts of the application can use this pool
 * to execute SQL queries.
 */
export default pool;