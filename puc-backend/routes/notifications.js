// routes/notifications.js
const express = require("express");

module.exports = (notifications) => {
  const router = express.Router();

  // GET all notifications for a student
  router.get("/:studentId", (req, res) => {
    res.json(notifications[req.params.studentId] || []);
  });

  // SEND a notification
  router.post("/send", (req, res) => {
    const { studentId, message } = req.body;
    if (!studentId || !message) return res.status(400).json({ error: "Missing fields" });

    if (!notifications[studentId]) notifications[studentId] = [];
    notifications[studentId].push(message);

    console.log("Notification sent to", studentId, ":", message);
    res.json({ success: true, message: "Notification added" });
  });

  return router;
};
