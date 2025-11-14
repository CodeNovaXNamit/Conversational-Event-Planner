const Conversation = require("../models/Conversation");
const { runAI } = require("../config/huggingface");
const { cleanAIResponse } = require("../utils/cleanAI");
const { searchVenues } = require("../services/foursquare.service");

async function handleChat(req, res) {
  try {
    const { message, conversationId } = req.body;

    let convo = await Conversation.findById(conversationId);
    if (!convo) {
      convo = await Conversation.create({ messages: [] });
    }

    convo.messages.push({ sender: "user", text: message });
    await convo.save();

    const aiRaw = await runAI(message);
    const aiResponse = cleanAIResponse(aiRaw);

    let venues = [];
    if (aiResponse.toLowerCase().includes("venue")) {
      venues = await searchVenues("restaurant", "New Delhi");
    }

    convo.messages.push({ sender: "ai", text: aiResponse });
    await convo.save();

    res.json({
      conversationId: convo._id,
      reply: aiResponse,
      venues,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
}

module.exports = { handleChat };
