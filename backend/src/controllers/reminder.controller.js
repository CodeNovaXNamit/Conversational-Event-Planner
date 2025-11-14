const Event = require("../models/Event");
const { sendReminder } = require("../services/email.service");

async function createReminder(req, res) {
  try {
    const { eventId, email } = req.body;

    const event = await Event.findById(eventId);

    await sendReminder(email, event);

    res.json({ message: "Reminder sent!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send reminder" });
  }
}

module.exports = { createReminder };
