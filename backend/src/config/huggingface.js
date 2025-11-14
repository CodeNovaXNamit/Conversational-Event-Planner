const { HfInference } = require("@huggingface/inference");
const { HUGGINGFACE_API_KEY, HUGGINGFACE_MODEL } = require("./env");

const hf = new HfInference(HUGGINGFACE_API_KEY);

async function runAI(prompt) {
  const res = await hf.textGeneration({
    model: HUGGINGFACE_MODEL,
    inputs: prompt,
    parameters: {
      max_new_tokens: 350,
      temperature: 0.3,
    },
  });

  return res.generated_text;
}

module.exports = { runAI };


