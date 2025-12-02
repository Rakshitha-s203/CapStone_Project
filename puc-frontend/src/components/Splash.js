// src/components/Splash.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-logo">SmartPath</div>
      <div className="loader"></div>
      <p className="splash-text">Loading your smart journey...</p>
    </div>
  );
};

export default Splash;
