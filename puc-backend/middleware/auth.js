const jwt = require("jsonwebtoken");

const JWT_SECRET = "SMART_PATH_SECRET_123";

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid token" });
  }
};
