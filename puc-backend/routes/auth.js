// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../config/firebase");

// Secret for JWT
const JWT_SECRET = "SMART_PATH_SECRET_123"; // change later

// ======================= SIGNUP =========================
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const userRef = db.collection("users").doc(email.toLowerCase());
    const userSnap = await userRef.get();

    if (userSnap.exists)
      return res.status(409).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await userRef.set({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
      progress: {},
    });

    console.log("✅ Firebase signup:", email);
    return res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ======================= LOGIN =========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const userRef = db.collection("users").doc(email.toLowerCase());
    const userSnap = await userRef.get();

    if (!userSnap.exists)
      return res.status(404).json({ error: "User not found" });

    const user = userSnap.data();
    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    delete user.password;

    console.log("✅ Firebase login:", email);

    return res.json({
      message: "Login successful",
      token,
      user,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
