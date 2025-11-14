// backend/src/config/db.js

const mongoose = require("mongoose");
const { MONGO_URI } = require("./env");

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);   // <-- this must have ) here
    console.log("[DB] MongoDB connected");
  } catch (err) {
    console.error("[DB] Error:", err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
