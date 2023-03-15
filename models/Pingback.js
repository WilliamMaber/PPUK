const mongoose = require("mongoose");

const pingbackSchema = new mongoose.Schema({
  sourceUrl: {
    type: String,
    required: true,
  },
  targetUrl: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Pingback = mongoose.model("Pingback", pingbackSchema);

module.exports = Pingback;
