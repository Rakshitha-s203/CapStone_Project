const express = require('express');
const { getFirestore } = require('firebase-admin/firestore');
const auth = require('../middleware/auth');
const multer = require('multer');
const router = express.Router();
const db = getFirestore();

// Multer setup for submissions
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Create assignment (Faculty only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'faculty') return res.status(403).json({ error: 'Unauthorized' });
  const { courseId, title, description, dueDate, maxMarks } = req.body;
  try {
    const docRef = await db.collection('assignments').add({
      courseId,
      title,
      description,
      dueDate: new Date(dueDate),
      maxMarks: Number(maxMarks),
      submissions: [],
      createdBy: req.user.id,
      createdAt: new Date()
    });
    res.status(201).json({ id: docRef.id, message: 'Assignment created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit assignment (Student only)
router.post('/submit', auth, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Unauthorized' });
  const { assignmentId } = req.body;
  try {
    const assignmentDoc = await db.collection('assignments').doc(assignmentId).get();
    if (!assignmentDoc.exists) return res.status(404).json({ error: 'Assignment not found' });
    const assignment = assignmentDoc.data();
    const submission = {
      studentId: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      submittedAt: new Date(),
      marksObtained: null,
      feedback: ''
    };
    assignment.submissions.push(submission);
    await db.collection('assignments').doc(assignmentId).update({ submissions: assignment.submissions });
    res.json({ message: 'Submission uploaded' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get assignments for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const assignments = await db.collection('assignments').where('courseId', '==', req.params.courseId).get();
    res.json(assignments.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Grade submission (Faculty only)
router.put('/grade/:assignmentId/:studentId', auth, async (req, res) => {
  if (req.user.role !== 'faculty') return res.status(403).json({ error: 'Unauthorized' });
  const { marksObtained, feedback } = req.body;
  try {
    const assignmentDoc = await db.collection('assignments').doc(req.params.assignmentId).get();
    if (!assignmentDoc.exists) return res.status(404).json({ error: 'Assignment not found' });
    const assignment = assignmentDoc.data();
    const submissionIndex = assignment.submissions.findIndex(s => s.studentId === req.params.studentId);
    if (submissionIndex === -1) return res.status(404).json({ error: 'Submission not found' });
    assignment.submissions[submissionIndex].marksObtained = Number(marksObtained);
    assignment.submissions[submissionIndex].feedback = feedback;
    await db.collection('assignments').doc(req.params.assignmentId).update({ submissions: assignment.submissions });
    res.json({ message: 'Graded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;