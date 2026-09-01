const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Counter = require("./Counter");

const studentSchema = new mongoose.Schema(
  {
    // Core identity
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, unique: true, trim: true }, // server-generated, never from client
    class: { type: String, required: true, trim: true },
    section: { type: String, trim: true },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    bFormNumber: { type: String, trim: true },
    bloodGroup: { type: String, trim: true },
    religion: { type: String, trim: true },
    nationality: { type: String, trim: true, default: "Pakistani" },
    photoUrl: { type: String, trim: true },

    // Contact
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },

    // Portal access
    username: { type: String, trim: true, unique: true, sparse: true },
    password: { type: String, select: false },

    // Parent / guardian
    fatherName: { type: String, trim: true },
    fatherCnic: { type: String, trim: true },
    fatherPosition: { type: String, trim: true },
    fatherDepartment: { type: String, trim: true },
    fatherPhone: { type: String, trim: true },
    fatherEmail: { type: String, trim: true, lowercase: true },
    emergencyContact: { type: String, trim: true },

    // Academic / enrollment
    previousSchool: { type: String, trim: true },
    enrollmentDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },

    // Fees
    admissionFee: { type: Number, default: 0 },
    monthlyTuitionFee: { type: Number, default: 0 },
    securityDeposit: { type: Number, default: 0 },
    feeDiscountPercent: { type: Number, default: 0, min: 0, max: 100 },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Partially Paid"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Bank Transfer", "Cash", "Cheque", "Online Payment"],
      default: "Bank Transfer",
    },
  },
  { timestamps: true }
);

studentSchema.index({ name: "text", rollNumber: "text" });

// Auto-generate rollNumber like "2026-0001" on creation only
studentSchema.pre("save", async function (next) {
  if (!this.isNew || this.rollNumber) return next();
  try {
    const year = new Date().getFullYear();
    const counter = await Counter.findByIdAndUpdate(
      `student-${year}`,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.rollNumber = `${year}-${String(counter.seq).padStart(4, "0")}`;
    next();
  } catch (err) {
    next(err);
  }
});

// Hash password on create/whenever it's changed via .save()
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Student", studentSchema);