

      import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./authstyle.css";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("Sending faculty login request for:", email.toLowerCase());

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      console.log("Faculty login response:", res.data);

      setMessage(res.data.message || "Login successful");
      setLoading(false);
      // Navigate to student dashboard immediately
      navigate("/student/dashboard");
    } catch (err) {
      setLoading(false);
      console.error("Login error:", err);

      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please try again.";

      setMessage(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card slide-in">
        <h2 className="auth-title">Student Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-footer">
          Don’t have an account?{" "}
          <Link to="/student/signup" className="auth-link">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;


/*import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./authstyle.css";

const FacultyLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("Sending faculty login request for:", email.toLowerCase());

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      console.log("Faculty login response:", res.data);

      setMessage(res.data.message || "Login successful");
      setLoading(false);

      // Navigate to faculty dashboard
      navigate("/faculty/dashboard");
    } catch (err) {
      setLoading(false);
      console.error("Faculty login error:", err);

      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please try again.";

      setMessage(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card slide-in">
        <h2 className="auth-title">Faculty Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-footer">
          Don’t have an account?{" "}
          <Link to="/faculty/signup" className="auth-link">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FacultyLogin;
 */