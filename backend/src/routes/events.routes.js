// backend/src/routes/events.routes.js

const express = require("express");
const router = express.Router();
const { createEvent, getEvents } = require("../controllers/events.controller");

// GET /api/events
router.get("/", getEvents);

// POST /api/events
router.post("/", createEvent);

module.exports = router;
