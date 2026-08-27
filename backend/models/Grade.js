const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: String, required: true, trim: true },
    examType: { type: String, enum: ["quiz", "midterm", "final"], required: true },
    marks: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, required: true, default: 100 },
    term: { type: String, required: true, trim: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

gradeSchema.virtual("percentage").get(function getPercentage() {
  if (!this.maxMarks) return 0;
  return Math.round((this.marks / this.maxMarks) * 1000) / 10;
});
gradeSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Grade", gradeSchema);
