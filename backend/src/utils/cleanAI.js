function cleanAIResponse(text) {
  if (!text) return "";

  return text
    .replace(/[\n\r]/g, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
}

module.exports = { cleanAIResponse };
