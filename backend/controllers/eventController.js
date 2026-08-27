const Event = require("../models/Event");

// GET /api/events  (everyone; results scoped by class where relevant)
async function getEvents(req, res, next) {
  try {
    let filter = {};

    if (req.user.role === "teacher") {
      filter = { $or: [{ classApplicable: "all" }, { classApplicable: { $in: req.user.assignedClasses } }] };
    }
    // Admin sees everything; parent sees "all" plus their children's classes
    // (kept simple here - a fuller version would look up each child's class)

    const events = await Event.find(filter).sort({ date: 1 });
    res.json({ count: events.length, events });
  } catch (err) {
    next(err);
  }
}

// POST /api/events  (admin: any event, teacher: class-level only)
async function createEvent(req, res, next) {
  try {
    const { classApplicable } = req.body;

    if (req.user.role === "teacher") {
      if (classApplicable === "all") {
        return res.status(403).json({ message: "Teachers can only create class-level events, not school-wide ones." });
      }
      if (!req.user.assignedClasses.includes(classApplicable)) {
        return res.status(403).json({ message: "You can only create events for your own class." });
      }
    }

    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ event });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/events/:id  (admin only, enforced by route middleware)
async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json({ message: "Event deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getEvents, createEvent, deleteEvent };
