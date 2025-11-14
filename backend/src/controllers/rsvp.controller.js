const Rsvp = require("../models/Rsvp");

async function submitRsvp(req, res) {
  const r = await Rsvp.create(req.body);
  res.status(201).json(r);
}

module.exports = { submitRsvp };
 