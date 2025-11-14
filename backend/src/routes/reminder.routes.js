// backend/src/routes/rsvp.routes.js

const express = require("express");
const router = express.Router();
const { submitRsvp } = require("../controllers/rsvp.controller");

// POST /api/rsvp
router.post("/", submitRsvp);

module.exports = router;
