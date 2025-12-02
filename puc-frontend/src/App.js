import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Splash from "./components/Splash";
import Home from "./components/Home";
import FileUpload from "./components/StudentDashboard/FileUpload"; // ✅ correct path


// Student
import StudentLogin from "./components/Studentlogin";
import StudentSignup from "./components/Studentsignup";
import StudentDashboard from "./components/StudentDashboard/StudentDashboard";

// Faculty
import FacultyLogin from "./components/Facultylogin";
import FacultySignup from "./components/Facultysignup";
import FacultyDashboard from "./components/FacultyDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/fileupload" element={< FileUpload/>} />

        {/* Student */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
       {/*<Route path="/student/mycourses/:subject" element={<MyCourseDetail />} />*/}

        {/* Faculty */}
        <Route path="/faculty/login" element={<FacultyLogin />} />
        <Route path="/faculty/signup" element={<FacultySignup />} />
       <Route path="/faculty/Dashboard" element={<FacultyDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
