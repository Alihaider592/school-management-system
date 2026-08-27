const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Event = require("../models/Event");

const LOW_ATTENDANCE_THRESHOLD = 75;

// GET /api/dashboard  - summary + in-app alerts, scoped by role
async function getDashboard(req, res, next) {
  try {
    const user = req.user;
    let studentFilter = {};
    if (user.role === "teacher") studentFilter = { class: { $in: user.assignedClasses } };
    if (user.role === "parent") studentFilter = { _id: { $in: user.children } };

    const students = await Student.find(studentFilter);
    const studentIds = students.map((s) => s._id);

    // Low-attendance alert list (Level 1: in-app banner from the alert lecture)
    const attendanceRecords = await Attendance.find({ student: { $in: studentIds } });
    const byStudent = {};
    attendanceRecords.forEach((r) => {
      const key = r.student.toString();
      byStudent[key] = byStudent[key] || { total: 0, present: 0 };
      byStudent[key].total += 1;
      if (r.status === "present") byStudent[key].present += 1;
    });

    const lowAttendanceAlerts = students
      .map((s) => {
        const stats = byStudent[s._id.toString()];
        if (!stats || stats.total === 0) return null;
        const pct = Math.round((stats.present / stats.total) * 1000) / 10;
        return pct < LOW_ATTENDANCE_THRESHOLD
          ? { studentId: s._id, name: s.name, rollNumber: s.rollNumber, attendancePercentage: pct }
          : null;
      })
      .filter(Boolean);

    const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5);

    res.json({
      totalStudents: students.length,
      lowAttendanceAlerts,
      upcomingEvents,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };
