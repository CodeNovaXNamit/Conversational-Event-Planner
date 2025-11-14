const { runAI } = require("../config/ai");
const Conversation = require("../models/Conversation");

async function handleChat(req, res) {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await runAI(message);

    let conv;

    if (!conversationId) {
      conv = await Conversation.create({
        messages: [{ sender: "user", text: message }, { sender: "ai", text: reply }]
      });
    } else {
      conv = await Conversation.findById(conversationId);
      conv.messages.push({ sender: "user", text: message });
      conv.messages.push({ sender: "ai", text: reply });
      await conv.save();
    }

    res.json({
      conversationId: conv._id,
      reply,
      venues: [] // Placeholder for future venue recommendations
    });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "AI error" });
  }
}

module.exports = { handleChat };
