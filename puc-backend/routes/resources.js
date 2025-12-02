const express = require('express');
const { getFirestore } = require('firebase-admin/firestore');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const db = getFirestore();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Upload resource (Faculty only)
router.post('/', auth, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'faculty') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const resource = {
      title: req.body.title,
      courseId: req.body.courseId,
      type: req.body.type,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      description: req.body.description,
      uploadedBy: req.user.id,
      uploadedAt: new Date()
    };
    const docRef = await db.collection('resources').add(resource);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get resources for a course
router.get('/course/:id', auth, async (req, res) => {
  try {
    const resources = await db.collection('resources').where('courseId', '==', req.params.id).get();
    res.json(resources.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download resource
router.get('/download/:id', auth, async (req, res) => {
  try {
    const doc = await db.collection('resources').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Resource not found' });
    const resource = doc.data();
    res.download(path.join(__dirname, '..', resource.filePath));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete resource (Faculty only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'faculty') return res.status(403).json({ error: 'Unauthorized' });
  try {
    await db.collection('resources').doc(req.params.id).delete();
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;