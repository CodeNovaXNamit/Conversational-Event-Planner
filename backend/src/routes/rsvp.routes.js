// backend/src/routes/reminder.routes.js

const express = require("express");
const router = express.Router();
const { createReminder } = require("../controllers/reminder.controller");

// POST /api/reminder
router.post("/", createReminder);

module.exports = router;
