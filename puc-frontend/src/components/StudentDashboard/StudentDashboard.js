import React, { useState } from "react";
import { Book, FileText, Bell, User, LogOut } from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dummy data for student
const dummyCourses = [
  { id: 1, name: "Physics", code: "PHY101", attendance: 85, grade: "A" },
  { id: 2, name: "Chemistry", code: "CHE101", attendance: 90, grade: "A+" },
  { id: 3, name: "Mathematics", code: "MAT101", attendance: 80, grade: "B+" },
];

const dummyAssignments = [
  { id: 1, course: "Physics", title: "Lab Report", submitted: true },
  { id: 2, course: "Chemistry", title: "Assignment 2", submitted: false },
  { id: 3, course: "Mathematics", title: "Quiz 1", submitted: true },
];

const dummyNotifications = [
  { id: 1, text: "New assignment uploaded in Physics" },
  { id: 2, text: "Grades updated for Chemistry" },
];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [courses, setCourses] = useState(dummyCourses);
  const [assignments, setAssignments] = useState(dummyAssignments);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [profile, setProfile] = useState({
    name: "Rakshitha S",
    email: "rakshitha@student.edu",
    program: "PUC Science",
  });

  const handleLogout = () => {
    window.location.href = "/";
  };
  // ⬇⬇⬇ Paste here
  const [newCoursePopup, setNewCoursePopup] = useState(null);

  // Trigger alert when faculty uploads a new course
  const triggerNewCoursePopup = (courseName) => {
    setNewCoursePopup(courseName);

    setTimeout(() => {
      setNewCoursePopup(null);
    }, 3000);
  };

  const downloadFile = (courseName) => {
    // Redirect to KSEEB syllabus website
    window.open("https://kseeb.karnataka.gov.in", "_blank");
  };
  

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleProfileSave = () => {
    alert("Profile saved successfully!");
  };

  // Chart data
  const chartData = {
    labels: courses.map(c => c.name),
    datasets: [
      {
        label: "Attendance %",
        data: courses.map(c => c.attendance),
        backgroundColor: "#2563eb",
        borderRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Course Attendance", font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="brand"><h2>Student Portal</h2></div>
        <ul>
          <li onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "active" : ""}><Book /> <span>Dashboard</span></li>
          <li
  onClick={() => {
    setActiveTab("courses");
    triggerNewCoursePopup("New Course Uploaded!");
  }}
  className={activeTab === "courses" ? "active" : ""}>
  <Book /> <span>Courses</span>
</li>

          <li onClick={() => setActiveTab("assignments")} className={activeTab === "assignments" ? "active" : ""}><FileText /> <span>Assignments</span></li>
          <li onClick={() => setActiveTab("notifications")} className={activeTab === "notifications" ? "active" : ""}><Bell /> <span>Notifications</span></li>
          <li onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active" : ""}><User /> <span>Profile</span></li>
          <li onClick={handleLogout}><LogOut /> <span>Logout</span></li>
        </ul>
      </nav>

      {/* Main Area */}
      <main className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="search">
            <input placeholder="Search courses, assignments..." />
          </div>
          <div className="profile-area">
            <div className="avatar">{profile.name.split(" ").map(n => n[0]).join("")}</div>
            <div className="prof-text">
              <div className="name">{profile.name}</div>
              <div className="email">{profile.email}</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="page-content">
          {activeTab === "dashboard" && (
            <div className="content-grid">
              <div className="card">
                <h2 className="welcome">Welcome, {profile.name}</h2>
                <div className="stats-grid">
                  <div className="stat">
                    <div className="stat-num">{courses.length}</div>
                    <div className="stat-label">Courses</div>
                  </div>
                  <div className="stat">
                    <div className="stat-num">{assignments.filter(a => a.submitted).length}</div>
                    <div className="stat-label">Assignments Submitted</div>
                  </div>
                  <div className="stat">
                    <div className="stat-num">{notifications.length}</div>
                    <div className="stat-label">Notifications</div>
                  </div>
                </div>
                <div style={{ marginTop: '24px' }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="content card">
              <h2>My Courses</h2>
              <table className="table">
                <thead>
                  <tr><th>Course</th><th>Code</th><th>Attendance</th><th>Grade</th></tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id}>
                      <td>{course.name}</td>
                      <td>{course.code}</td>
                      <td>{course.attendance}%</td>
                      <td>{course.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "assignments" && (
            <div className="content card">
              <h2>Assignments</h2>
              <table className="table">
                <thead>
                  <tr><th>Course</th><th>Title</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {assignments.map(a => (
                    <tr key={a.id}>
                      <td>{a.course}</td>
                      <td>{a.title}</td>
                      <td>{a.submitted ? "Submitted" : "Pending"}</td>
                      <td>
                        <button className="btn-primary" onClick={() => downloadFile(a.title)}>
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="content card">
              <h2>Notifications</h2>
              <ul className="notifications">
                {notifications.map(n => (
                  <li key={n.id}>{n.text}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="content card">
              <h2>Edit Profile</h2>
              <div className="profile-edit">
                <label>Name:</label>
                <input type="text" name="name" value={profile.name} onChange={handleProfileChange} />
                <label>Email:</label>
                <input type="email" name="email" value={profile.email} onChange={handleProfileChange} />
                <label>Program:</label>
                <input type="text" name="program" value={profile.program} onChange={handleProfileChange} />
                <button className="btn-primary" onClick={handleProfileSave}>Save</button>
              </div>
            </div>
          )}
        </section>
      </main>

      <style jsx>{`
        /* Dashboard */
        .dashboard { padding-left: 22px; font-family: 'Poppins', sans-serif; background: #f5f7fa; min-height: 10vh; transition: all 0.3s ease; }
        .sidebar { position: fixed; top: 0; left: 0; width: 220px; height: 100vh; background: linear-gradient(180deg, #afdef9ff, #2469d8ff); padding: 30px 18px; display: flex; flex-direction: column; box-shadow: 4px 0 20px rgba(0,0,0,0.12); transition: all 0.3s ease; }
        .sidebar .brand h3 { color: #130303ff; font-size: 20px; font-weight: 700; margin-bottom: 25px; letter-spacing: 1px; }
        .sidebar ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 16px; }
        .sidebar li { color: #050505ff; display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; cursor: pointer; transition: all 0.3s ease; font-size: 15px; }
        .sidebar li:hover, .sidebar li.active { background: rgba(13, 11, 11, 0.1); color: #373232ff; transform: translateX(6px); }
        .main-area { margin-left: 220px; padding: 20px 30px; transition: all 0.3s ease; }
        .topbar { display: flex; justify-content: space-between; align-items: center; background: #fafcfcff; padding: 12px 20px; border-radius: 12px; box-shadow: 0 4px 25px rgba(0,0,0,0.08); margin-bottom: 20px; }
        .topbar .search input { width: 300px; padding: 8px 14px; border-radius: 12px; border: 1px solid #f5f9fdff; font-size: 14px; transition: all 0.3s ease; }
        .topbar .search input:focus { border-color: #2563eb; box-shadow: 0 0 10px rgba(181, 199, 237, 0.25); outline: none; }
        .profile-area { display: flex; align-items: center; gap: 14px; }
        .avatar { width: 45px; height: 45px; border-radius: 50%; background: #2563eb; color: #fff; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); }
        .page-content { display: grid; grid-template-columns: 1fr; gap: 20px; animation: fadeIn 0.7s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .card { background: #f6fafaff; border-radius: 14px; padding: 20px; box-shadow: 0 12px 30px rgba(2,6,23,0.08); transition: all 0.3s ease; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 18px 35px rgba(2,6,23,0.12); }
        .welcome { font-size: 20px; margin-bottom: 16px; font-weight: 600; color: #0f172a; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; }
        .stat { background: #f8fafc; padding: 14px; border-radius: 12px; text-align: center; transition: all 0.3s ease; }
        .stat:hover { background: #a3a4a6ff; }
        .stat-num { font-size: 20px; font-weight: 600; color: #0f172a; }
        .stat-label { font-size: 13px; color: #6b7280; margin-top: 6px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 14px; }
        .table th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; }
        .table td { border-bottom: 1px solid #f1f5f9; padding: 12px; }
        .btn-primary { background: #2563eb; color: white; padding: 8px 12px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; transition: all 0.3s ease; }
        .btn-primary:hover { background: #3b82f6; transform: translateY(-2px); }
        .notifications { list-style: disc; padding-left: 20px; }
        .notifications li { margin-bottom: 10px; font-size: 14px; color: #1f2937; transition: all 0.2s ease; }
        .notifications li:hover { color: #2563eb; }
        .profile-edit label { display: block; margin-top: 12px; margin-bottom: 4px; font-weight: 500; }
        .profile-edit input { width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 12px; font-size: 14px; }
        
        @media (max-width: 900px) { .dashboard { padding-left: 0; } .sidebar { width: 100%; height: auto; flex-direction: row; overflow-x: auto; } .sidebar ul { flex-direction: row; gap: 12px; } .main-area { margin-left: 0; padding: 12px; } .stats-grid { grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); } }
      /* Popup Alert */
.popup-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #2563eb;
  color: white;
  padding: 12px 18px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  animation: slideIn 0.4s ease, fadeOut 0.5s ease 2.5s forwards;
  z-index: 9999;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeOut {
  to { opacity: 0; transform: translateX(100%); }
}

      `}</style>
    </div>
  );
};

export default StudentDashboard;
