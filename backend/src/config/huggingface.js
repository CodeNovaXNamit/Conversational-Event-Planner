// backend/src/config/huggingface.js

const fetch = require("node-fetch");
const { HUGGINGFACE_API_KEY, HUGGINGFACE_MODEL } = require("./env");

async function runAI(prompt) {
  try {
    const base = "https://router.huggingface.co/hf-inference";
    const url = `${base}/models/${encodeURIComponent(HUGGINGFACE_MODEL)}/v1/chat/completions`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: HUGGINGFACE_MODEL,
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7
      }),
    });

    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (parseErr) {
      console.error("HUGGINGFACE ERROR: non-JSON response", response.status, text);
      if (response.status === 404 || (typeof text === 'string' && text.includes('Not Found'))) {
        console.error(
          "Hugging Face router returned 404. The correct router path may require the model in the URL, e.g.:",
          `https://router.huggingface.co/hf-inference/models/${encodeURIComponent(HUGGINGFACE_MODEL)}/chat/completions`
        );
      }
      return "AI processing failed.";
    }

    if (json?.choices?.[0]?.message?.content) {
      return json.choices[0].message.content;
    }

    console.log("HF RAW JSON:", json);
    return "AI could not respond.";
  } catch (err) {
    console.error("HUGGINGFACE ERROR:", err);
    return "AI processing failed.";
  }
}

module.exports = { runAI };
