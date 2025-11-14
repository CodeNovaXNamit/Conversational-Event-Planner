// backend/src/models/Conversation.js

const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    messages: [
      {
        sender: { type: String, enum: ["user", "ai"], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
