const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    class: { type: String, required: true, trim: true },
    section: { type: String, trim: true },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    parentPhone: { type: String, trim: true },
    address: { type: String, trim: true },
    photoUrl: { type: String, trim: true },
    enrollmentDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

studentSchema.index({ name: "text", rollNumber: "text" });

module.exports = mongoose.model("Student", studentSchema);
