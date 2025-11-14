// backend/src/index.js

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { PORT } = require("./config/env");

// Route imports
const chatRoutes = require("./routes/chat.routes");
const eventRoutes = require("./routes/events.routes");
const rsvpRoutes = require("./routes/rsvp.routes");
const reminderRoutes = require("./routes/reminder.routes");

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json()); // parse JSON body

// ---------- HEALTH CHECK ----------
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Conversational Event Planner backend is running 🚀",
  });
});

// ---------- API ROUTES ----------
app.use("/api/chat", chatRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/reminder", reminderRoutes);

// ---------- GLOBAL 404 ----------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------- START SERVER ----------
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Server] Running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[Server] Failed to start:", err.message);
    process.exit(1);
  }
}

startServer();
console.log("CHAT ROUTES:", chatRoutes);
