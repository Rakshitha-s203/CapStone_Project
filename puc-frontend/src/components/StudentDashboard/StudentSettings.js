// src/components/StudentDashboard/StudentSettings.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentDashboard.css";

const StudentSettings = ({ studentId }) => {
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load student data from backend dynamically
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/students/${studentId}`);
        if (res.data) {
          setStudentData({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            password: "", // never populate password
          });
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
        alert("Failed to load student data. Check your backend API.");
      } finally {
        setLoading(false); // make sure to stop loading even on error
      }
    };

    if (studentId) {
      fetchStudent();
    } else {
      setLoading(false); // no studentId provided
    }
  }, [studentId]);

  // Handle input changes dynamically
  const handleChange = (e) => {
    setStudentData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
<StudentSettings studentId="student1" />

  // Save updated student info via API
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/students/${studentId}`, {
        name: studentData.name,
        email: studentData.email,
        phone: studentData.phone,
        // password update can be handled separately
      });
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving student data:", err);
      setMessage("Failed to save student data.");
    }
  };

  if (loading) return <p>Loading student data...</p>;

  return (
    <div className="settings-container">
      <h3>Student Settings</h3>
      {message && <p className="message">{message}</p>}

      <div className="form-group">
        <label>Name:</label>
        <input type="text" name="name" value={studentData.name} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input type="email" name="email" value={studentData.email} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Phone:</label>
        <input type="text" name="phone" value={studentData.phone} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Password (optional):</label>
        <input
          type="password"
          name="password"
          value={studentData.password}
          placeholder="Enter new password"
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default StudentSettings;
