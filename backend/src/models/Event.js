// backend/src/models/Event.js

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String },         // or Date if you prefer
    time: { type: String },
    location: { type: String },
    budget: { type: Number },
    guests: { type: Number },
    notes: { type: String },
    reminder: { type: String },     // or Date
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
