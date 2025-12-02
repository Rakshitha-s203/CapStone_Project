// routes/courses.js
const express = require("express");

module.exports = (courses, notifications) => {
  const router = express.Router();

  // GET all courses for a student
  router.get("/:studentId", (req, res) => {
    const studentCourses = courses[req.params.studentId] || [];
    res.json(studentCourses);
  });

  // GET courses by stream
  router.get("/stream/:studentId/:stream", (req, res) => {
    const studentCourses = courses[req.params.studentId] || [];
    const filtered = studentCourses.filter(c => c.stream === req.params.stream);
    res.json(filtered);
  });

  // GET courses by PUC year
  router.get("/year/:studentId/:year", (req, res) => {
    const studentCourses = courses[req.params.studentId] || [];
    const filtered = studentCourses.filter(c => c.pucYear === Number(req.params.year));
    res.json(filtered);
  });

  // CREATE a new course
  router.post("/:studentId", (req, res) => {
    const { title, stream, pucYear, subject, description } = req.body;
    if (!courses[req.params.studentId]) courses[req.params.studentId] = [];

    const newCourse = {
      id: courses[req.params.studentId].length + 1,
      title, stream, pucYear, subject, description,
    };

    courses[req.params.studentId].push(newCourse);

    // Add notification
    if (!notifications[req.params.studentId]) notifications[req.params.studentId] = [];
    notifications[req.params.studentId].push(`${title} (${subject}) added.`);

    res.status(201).json(newCourse);
  });

  return router;
};
