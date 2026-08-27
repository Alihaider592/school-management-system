const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// Ensures a teacher can only mark/view attendance for their own class,
// and a parent can only view their own child's attendance.
async function assertCanAccessStudent(user, studentId) {
  const student = await Student.findById(studentId);
  if (!student) {
    const err = new Error("Student not found.");
    err.statusCode = 404;
    throw err;
  }
  if (user.role === "teacher" && !user.assignedClasses.includes(student.class)) {
    const err = new Error("You don't have access to this class.");
    err.statusCode = 403;
    throw err;
  }
  if (user.role === "parent" && !user.children.some((c) => c.equals(student._id))) {
    const err = new Error("You can only view your own child's attendance.");
    err.statusCode = 403;
    throw err;
  }
  return student;
}

// POST /api/attendance  (admin, teacher)
async function markAttendance(req, res, next) {
  try {
    const { student, date, status, remarks } = req.body;
    await assertCanAccessStudent(req.user, student);

    // upsert: one record per student per day
    const record = await Attendance.findOneAndUpdate(
      { student, date },
      { student, date, status, remarks, markedBy: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ attendance: record });
  } catch (err) {
    next(err);
  }
}

// GET /api/attendance/student/:studentId
async function getAttendanceForStudent(req, res, next) {
  try {
    await assertCanAccessStudent(req.user, req.params.studentId);

    const records = await Attendance.find({ student: req.params.studentId }).sort({ date: -1 });
    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const percentage = total ? Math.round((present / total) * 1000) / 10 : null;

    res.json({ records, summary: { total, present, percentage } });
  } catch (err) {
    next(err);
  }
}

// GET /api/attendance/class/:className  (admin, teacher)
async function getAttendanceForClass(req, res, next) {
  try {
    const { className } = req.params;
    const { date } = req.query;

    if (req.user.role === "teacher" && !req.user.assignedClasses.includes(className)) {
      return res.status(403).json({ message: "You don't have access to this class." });
    }

    const students = await Student.find({ class: className });
    const studentIds = students.map((s) => s._id);

    const filter = { student: { $in: studentIds } };
    if (date) filter.date = new Date(date);

    const records = await Attendance.find(filter).populate("student", "name rollNumber");
    res.json({ count: records.length, records });
  } catch (err) {
    next(err);
  }
}

module.exports = { markAttendance, getAttendanceForStudent, getAttendanceForClass };
