// backend/src/controllers/chat.controller.js

const Conversation = require("../models/Conversation");
const Event = require("../models/Event");
const { runAI } = require("../config/ai");

// ---------- SYSTEM PROMPT (tells the model how to behave) ----------

const SYSTEM_PROMPT = `
You are "Conversational Event Planner", an AI assistant that helps users
plan events ONLY through natural conversation (no forms).

Always respond with a SINGLE JSON object with EXACTLY this structure:

{
  "reply": "Natural language message to show in the chat UI.",
  "intent": "smalltalk | create_event | update_event | ask_question | venue_search | rsvp | reminder | unknown",
  "event": {
    "title": "string or null",
    "date": "YYYY-MM-DD or null",
    "time": "HH:MM or null",
    "location": "string or null",
    "budget": "number or null",
    "guests": "number or null",
    "notes": "string or null",
    "reminder": "ISO datetime string or null"
  },
  "missing_fields": ["date", "time"],
  "venue_query": {
    "location": "string or null",
    "type": "string or null",
    "budget": "number or null",
    "capacity": "number or null"
  }
}

Rules:
- If the user is just greeting or chatting, set "intent": "smalltalk".
- If they want to plan a NEW event, set "intent": "create_event".
- If they are modifying an existing plan, use "update_event".
- If they ask about venues, use "venue_search" and fill "venue_query".
- If ANY important event details are missing, list them in "missing_fields"
  AND ask a clear follow-up question about them in "reply".
- If everything is filled for a new event, "missing_fields" should be [].
- "event" can be null if this turn is only smalltalk or a question.
- DO NOT wrap the JSON in backticks or any code block.
- DO NOT add explanations outside of the JSON. Respond with raw JSON only.
`;

// ---------- Helper: build history text from Conversation.messages ----------

function buildHistoryText(messages) {
  if (!messages || messages.length === 0) return "";
  return messages
    .map((m) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.text}`)
    .join("\n");
}

// ---------- Helper: safely parse JSON that might have extra text ----------

function safeParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      const slice = text.slice(first, last + 1);
      try {
        return JSON.parse(slice);
      } catch (inner) {
        console.error("safeParseJSON inner error:", inner);
      }
    }
    console.error("safeParseJSON failed:", err, "raw text:", text);
    return null;
  }
}

// ------------------------- MAIN HANDLER ---------------------------

async function handleChat(req, res) {
  try {
    const { message, conversationId } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1) Load or create conversation
    let convo = null;
    if (conversationId) {
      try {
        convo = await Conversation.findById(conversationId);
      } catch {
        convo = null;
      }
    }
    if (!convo) {
      convo = await Conversation.create({
        messages: [],
      });
    }

    // 2) Build prompt: system instructions + history + latest user message
    const historyText = buildHistoryText(convo.messages);

    const fullPrompt = `
${SYSTEM_PROMPT}

Conversation so far:
${historyText}

User: ${message}
Assistant: (respond ONLY with the JSON object)
`.trim();

    // 3) Call OpenRouter via runAI
    const aiText = await runAI(fullPrompt);

    // 4) Parse JSON from AI
    const aiJson =
      safeParseJSON(aiText) || {
        reply: "I couldn't understand that.",
        intent: "unknown",
        event: null,
        missing_fields: [],
        venue_query: null,
      };

    const replyText = aiJson.reply || "Okay.";
    const intent = aiJson.intent || "unknown";
    const eventPayload = aiJson.event || null;
    const missingFields = Array.isArray(aiJson.missing_fields)
      ? aiJson.missing_fields
      : [];
    const venueQuery = aiJson.venue_query || null;

    let createdEvent = null;

    // 5) If AI says create_event and nothing is missing → save to MongoDB
    if (
      intent === "create_event" &&
      eventPayload &&
      missingFields.length === 0
    ) {
      const eventToSave = {
        title: eventPayload.title || "Untitled Event",
        date: eventPayload.date || null,
        time: eventPayload.time || null,
        location: eventPayload.location || null,
        budget: eventPayload.budget || null,
        guests: eventPayload.guests || null,
        notes: eventPayload.notes || null,
        reminder: eventPayload.reminder || null,
        conversationId: convo._id,
      };

      createdEvent = await Event.create(eventToSave);
    }

    // (Future) If intent === "venue_search" and venueQuery → call Foursquare here

    const venues = []; // placeholder for now

    // 6) Save both user + assistant messages into conversation
    convo.messages.push(
      { sender: "user", text: message },
      { sender: "ai", text: replyText }
    );
    await convo.save();

    // 7) Respond to frontend
    return res.json({
      conversationId: convo._id,
      reply: replyText,
      intent,
      missingFields,
      eventCreated: !!createdEvent,
      event: createdEvent,
      venues, // still returning this so old code isn't broken
    });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "AI error" });
  }
}

module.exports = { handleChat };
