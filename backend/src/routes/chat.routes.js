// backend/src/routes/chat.routes.js

const express = require("express");
const router = express.Router();
const { handleChat } = require("../controllers/chat.controller");

// POST /api/chat
router.post("/", handleChat);

module.exports = router;
