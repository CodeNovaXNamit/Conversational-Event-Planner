const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  messages: [
    {
      sender: String, // "user" or "ai"
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Conversation", ConversationSchema);

