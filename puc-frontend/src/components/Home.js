// src/components/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to SmartPath</h1>
      <p>Your all-in-one learning platform for Students & Faculty</p>
      
      <div className="home-buttons">
        <Link to="/student/login" className="btn btn-primary">Student Login</Link>
        <Link to="/faculty/login" className="btn btn-primary">Faculty Login</Link>
      </div>
    </div>
  );
};

export default Home;
