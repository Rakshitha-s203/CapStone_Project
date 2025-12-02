// src/components/StudentDashboard/CourseCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const CourseCard = ({ title, progress }) => {
  const navigate = useNavigate();

  const goToCourse = () => {
    // encode to handle spaces/special chars
    navigate(`/student/mycourses/${encodeURIComponent(title)}`);
  };

  return (
    <div className="course-card">
      <h4>{title}</h4>
      <div className="progress-bar">
        <div className="progress-filled" style={{ width: `${progress}%` }} />
      </div>
     <button
  className="btn btn-primary btn-sm"
  onClick={() => navigate(`/student/course/${encodeURIComponent(course.name.split(" ")[0])}`)}
>
  Continue
</button>
    </div>
  );
};

export default CourseCard;
