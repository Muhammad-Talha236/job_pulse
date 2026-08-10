// backend/src/server.js

import "dotenv/config";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    /*
     * Test database connection first.
     */ 
    await connectDatabase();

    /*
     * Start Express only after the database
     * connection has been verified.
     */
    app.listen(PORT, () => {
      console.log(`JobPulse API running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Failed to start JobPulse server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();