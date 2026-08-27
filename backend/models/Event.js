const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    type: {
      type: String,
      enum: ["exam", "holiday", "meeting", "deadline"],
      required: true,
    },
    // "all" means school-wide; otherwise a specific class like "10-B"
    classApplicable: { type: String, default: "all", trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
