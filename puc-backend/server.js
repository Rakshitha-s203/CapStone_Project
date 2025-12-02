// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Initialize app
const app = express();
const PORT = 5000;

// ========================================
// MIDDLEWARE
// ========================================
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ========================================
// MULTER CONFIG
// ========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ========================================
// TEMPORARY IN-MEMORY DATA
// ========================================
let students = {
  student1: { name: "Rakshitha", email: "rakshitha@example.com", password: "Rakshi@123", phone: "9876543210" },
  student2: { name: "John Doe", email: "john@example.com", password: "John@123", phone: "1234567890" },
};

let courses = {
  student1: [
    { id: 1, title: "Kannada", stream: "Arts", pucYear: 1, progress: 80 },
    { id: 2, title: "English", stream: "Arts", pucYear: 1, progress: 70 },
    { id: 3, title: "Physics", stream: "Science", pucYear: 1, progress: 60 },
  ],
  student2: [
    { id: 1, title: "Math", stream: "Science", pucYear: 2, progress: 50 },
    { id: 2, title: "Biology", stream: "Science", pucYear: 2, progress: 90 },
  ],
};

let notifications = {
  student1: ["Physics quiz scheduled for Friday.", "New Chemistry PDF uploaded."],
  student2: ["Math assignment due next week."],
};


// ========================================
// ROUTES IMPORT
// ========================================
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses")(courses, notifications); // pass in-memory objects
const notificationRoutes = require("./routes/notifications")(notifications); // pass in-memory object

// ROUTES MOUNT
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/notifications", notificationRoutes);

// ========================================
// FILE UPLOAD API
// ========================================
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    url: `http://localhost:${PORT}/uploads/${req.file.filename}`,
  });
});

// ========================================
// LOCAL SIGNUP & LOGIN
// ========================================
app.post("/api/local/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });

  const existing = Object.values(students).find((s) => s.email === email);
  if (existing) return res.status(400).json({ error: "Email already registered" });

  const id = `student${Object.keys(students).length + 1}`;
  students[id] = { name, email, password, phone: "N/A" };
  res.json({ message: "Signup successful", student: students[id] });
});

app.post("/api/local/login", (req, res) => {
  const { email, password } = req.body;

  const id = Object.keys(students).find(
    (sid) => students[sid].email === email && students[sid].password === password
  );

  if (!id) return res.status(401).json({ error: "Invalid email or password" });

  const student = students[id];
  res.json({ message: "Login successful", student: { id, name: student.name, email: student.email } });
});

// ========================================
// STUDENT PROFILE
// ========================================
app.get("/students/:id", (req, res) => {
  const student = students[req.params.id];
  student ? res.json(student) : res.status(404).json({ error: "Student not found" });
});

app.put("/students/:id", (req, res) => {
  const { name, email, phone } = req.body;
  if (!students[req.params.id]) return res.status(404).json({ error: "Student not found" });

  students[req.params.id] = { ...students[req.params.id], name, email, phone };
  res.json({ message: "Update successful", student: students[req.params.id] });
});

// ========================================
// ROOT
// ========================================
app.get("/", (req, res) => res.send("Backend running successfully!"));

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
