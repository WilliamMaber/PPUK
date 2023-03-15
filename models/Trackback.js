const mongoose = require("mongoose");

const trackbackSchema = new mongoose.Schema({
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
  verifiedDate: {
    type: Date,
  },
  errorMessage: {
    type: String,
  },
});

const Trackback = mongoose.model("Trackback", trackbackSchema);

module.exports = Trackback;
