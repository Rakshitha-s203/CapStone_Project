// src/components/Studentsignup.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./authstyle.css";

const Studentsignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Password strength validation
  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Password strength check
    if (!validatePassword(formData.password)) {
      setMessage(
        "Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character."
      );
      setLoading(false);
      return;
    }

    try {
      // API call to backend → backend will store securely in Firebase
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        ...formData,
        role: "student",
      });

      setMessage(res.data.message || "Signup successful!");
      setLoading(false);

      // Redirect after success
      
        navigate("/student/login");
      
    } catch (err) {
      setLoading(false);
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Signup failed. Please try again.";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <h2 className="auth-title">🎓 Student Signup</h2>

        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/student/login" className="auth-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Studentsignup;
