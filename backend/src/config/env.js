const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

module.exports = {
  PORT: process.env.PORT || 5000,
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
  HUGGINGFACE_MODEL: process.env.HUGGINGFACE_MODEL,
  MONGO_URI: process.env.MONGO_URI,
  FOURSQUARE_API_KEY: process.env.FOURSQUARE_API_KEY,
  EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
  AGORA_APP_ID: process.env.AGORA_APP_ID,
};

