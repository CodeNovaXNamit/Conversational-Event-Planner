const mongoose = require("mongoose");

const RsvpSchema = new mongoose.Schema({
  eventId: String,
  email: String,
  response: String, // yes/no/maybe
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Rsvp", RsvpSchema);

