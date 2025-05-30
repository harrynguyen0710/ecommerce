const mongoose = require("mongoose");

const OutboxSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
  },
  payload: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending",
  },
  retries: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastTriedAt: {
    type: Date,
  },
  error: {
    type: String,
  },

  metadata: {
    type: Object,
    default: {},
  },
});

module.exports = mongoose.model("OutboxEvent", OutboxSchema);
