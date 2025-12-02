const express = require('express');
const { getFirestore } = require('firebase-admin/firestore');
const auth = require('../middleware/auth');
const router = express.Router();
const db = getFirestore();

// Enroll in course (Student only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const enrollment = { ...req.body, enrolledAt: new Date() };
    const docRef = await db.collection('enrollments').add(enrollment);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student's enrollments
router.get('/student/:id', auth, async (req, res) => {
  try {
    const enrollments = await db.collection('enrollments').where('studentId', '==', req.params.id).get();
    res.json(enrollments.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get enrollments for a course (Faculty only)
router.get('/course/:id', auth, async (req, res) => {
  if (req.user.role !== 'faculty') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const enrollments = await db.collection('enrollments').where('courseId', '==', req.params.id).get();
    res.json(enrollments.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;