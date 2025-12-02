import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./authstyle.css";

const FacultySignup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("Sending faculty signup request for:", email.toLowerCase());

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email: email.toLowerCase(),
        password,
        role: "faculty",
      });

      console.log("Faculty signup response:", res.data);

      setMessage(res.data.message || "Signup successful");
      setLoading(false);

      // Redirect to login page
      navigate("/faculty/login");
    } catch (err) {
      setLoading(false);
      console.error("Faculty signup error:", err);

      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Signup failed. Please try again.";

      setMessage(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card slide-in">
        <h2 className="auth-title">Faculty Signup</h2>
        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/faculty/login" className="auth-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FacultySignup;
