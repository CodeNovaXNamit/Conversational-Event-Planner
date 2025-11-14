const Event = require("../models/Event");

// Create new event
async function createEvent(req, res) {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    console.error("Create Event Error:", err.message);
    res.status(500).json({ error: "Failed to create event" });
  }
}

// Get events (with pagination)
async function getEvents(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;   // page=1 default
    const limit = parseInt(req.query.limit) || 10; // limit=10 default
    const skip = (page - 1) * limit;

    const events = await Event.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Event.countDocuments();

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      events,
    });
  } catch (err) {
    console.error("Get Events Error:", err.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
}

module.exports = { getEvents, createEvent };
