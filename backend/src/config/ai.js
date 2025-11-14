// backend/src/config/ai.js
const fetch = require("node-fetch");

async function runAI(prompt) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "Conversational Event Planner",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 250,
        temperature: 0.7
      })
    });

    const json = await response.json();
    console.log("AI RESPONSE:", json);

    if (json?.choices?.[0]?.message?.content) {
      return json.choices[0].message.content;
    }

    return "AI could not generate a response.";
  } catch (err) {
    console.error("AI ERROR:", err);
    return "AI failed to process the request.";
  }
}

module.exports = { runAI };
