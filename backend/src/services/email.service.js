const axios = require("axios");
const {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} = require("../config/env");

async function sendReminder(toEmail, eventData) {
  const url = "https://api.emailjs.com/api/v1.0/email/send";

  await axios.post(url, {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: {
      to_email: toEmail,
      event_title: eventData.title,
      event_date: eventData.date,
      event_time: eventData.time,
    },
  });

  return true;
}

module.exports = { sendReminder };
