const bcrypt = require("bcryptjs");
const Student = require("../models/Student");

function scopeFilterForRole(user, baseFilter = {}) {
  if (user.role === "admin") return baseFilter;
  if (user.role === "teacher") {
    return { ...baseFilter, class: { $in: user.assignedClasses } };
  }
  return baseFilter;
}

function handleDbError(err, res, next) {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || { field: 1 })[0];
    return res.status(409).json({ message: `A student with that ${field} already exists.` });
  }
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: details[0] || "Validation failed.", details });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid student id." });
  }
  return next(err);
}

async function getStudents(req, res, next) {
  try {
    const { search, class: classFilter } = req.query;
    let filter = scopeFilterForRole(req.user);
    if (classFilter) filter.class = classFilter;
    if (search) filter.$text = { $search: search };
    const students = await Student.find(filter).sort({ name: 1 });
    res.json({ count: students.length, students });
  } catch (err) {
    next(err);
  }
}

async function getStudent(req, res, next) {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found." });
    if (req.user.role === "teacher" && !req.user.assignedClasses.includes(student.class)) {
      return res.status(403).json({ message: "You don't have access to this class." });
    }
    if (req.user.role === "parent" && !req.user.children.some((c) => c.equals(student._id))) {
      return res.status(403).json({ message: "You can only view your own child's record." });
    }
    res.json({ student });
  } catch (err) {
    handleDbError(err, res, next);
  }
}

// POST /api/students (admin only) — multipart/form-data via upload.single("studentPhoto")
async function createStudent(req, res, next) {
  try {
    const studentData = { ...req.body };
    delete studentData.rollNumber; // always server-generated, ignore anything client sends

    if (req.file) {
      studentData.photoUrl = `/uploads/student-photos/${req.file.filename}`;
    }

    const student = await Student.create(studentData);
    const safeStudent = student.toObject();
    delete safeStudent.password;
    res.status(201).json({ student: safeStudent });
  } catch (err) {
    handleDbError(err, res, next);
  }
}

// PUT /api/students/:id (admin only)
async function updateStudent(req, res, next) {
  try {
    const updates = { ...req.body };
    delete updates.rollNumber;

    if (req.file) {
      updates.photoUrl = `/uploads/student-photos/${req.file.filename}`;
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password; // don't wipe existing password with an empty string
    }

    const student = await Student.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
      context: "query",
    });
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json({ student });
  } catch (err) {
    handleDbError(err, res, next);
  }
}

async function deleteStudent(req, res, next) {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json({ message: "Student deleted." });
  } catch (err) {
    handleDbError(err, res, next);
  }
}

module.exports = { getStudents, getStudent, createStudent, updateStudent, deleteStudent };