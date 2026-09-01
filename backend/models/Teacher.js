const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Counter = require("./Counter");

const teacherSchema = new mongoose.Schema(
  {
    // Identity
    name: { type: String, required: true, trim: true },
    employeeId: { type: String, unique: true, trim: true }, // server-generated, never from client
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    cnic: { type: String, trim: true },
    photoUrl: { type: String, trim: true },

    // Contact
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    emergencyContact: { type: String, trim: true },

    // Portal access
    username: { type: String, trim: true, unique: true, sparse: true },
    password: { type: String, select: false },
    role: { type: String, default: "teacher" },

    // Professional
    primarySubject: { type: String, required: true, trim: true },
    qualification: { type: String, trim: true },
    experienceYears: { type: Number, default: 0 },
    department: { type: String, trim: true },
    joiningDate: { type: Date, default: Date.now },
    employmentType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Visiting"],
      default: "Full-Time",
    },

    // Assignment
    assignedClasses: [{ type: String, trim: true }],

    // Compensation
    monthlySalary: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

teacherSchema.index({ name: "text", employeeId: "text" });

// Auto-generate employeeId like "EMP-2026-0001" on creation only
teacherSchema.pre("save", async function (next) {
  if (!this.isNew || this.employeeId) return next();
  try {
    const year = new Date().getFullYear();
    const counter = await Counter.findByIdAndUpdate(
      `teacher-${year}`,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.employeeId = `EMP-${year}-${String(counter.seq).padStart(4, "0")}`;
    next();
  } catch (err) {
    next(err);
  }
});

// Hash password on create/whenever it's changed via .save()
teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Teacher", teacherSchema);