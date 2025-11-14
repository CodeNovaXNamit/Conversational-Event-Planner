const { runAI } = require("../ai/ai");
const Conversation = require("../models/Conversation");

exports.handleChat = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const aiResponse = await runAI(message);

    // If AI extracted event details
    const eventCreated = aiResponse.intent === "create_event";
    const eventData = aiResponse.event || null;

    // save conversation
    const convo = await Conversation.create({
      conversationId,
      userMessage: message,
      botReply: aiResponse.reply,
      event: eventData,
      eventCreated,
    });

    res.json({
      conversationId: convo._id,
      reply: aiResponse.reply,
      eventCreated,
      event: eventData,
    });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "AI error" });
  }
};
