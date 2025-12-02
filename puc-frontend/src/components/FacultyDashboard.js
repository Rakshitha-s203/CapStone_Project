import React, { useState, useEffect } from "react";
import { Book, Plus, Upload, User, LogOut, Trash, Edit, Save } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// FileUpload component
const FileUpload = ({ courseId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    const files = JSON.parse(localStorage.getItem(`course_${courseId}_files`) || "[]");
    setUploadedFiles(files);
  }, [courseId]);

  useEffect(() => {
    if (Notification.permission !== "granted") Notification.requestPermission();
  }, []);

  const handleUpload = () => {
    if (!selectedFile) return alert("Select a file to upload");
    const fileData = {
      name: selectedFile.name,
      size: selectedFile.size,
      date: new Date().toLocaleString(),
    };
    const files = [...uploadedFiles, fileData];
    localStorage.setItem(`course_${courseId}_files`, JSON.stringify(files));
    setUploadedFiles(files);
    setSelectedFile(null);

    // Add notification for this course
    const notifications = JSON.parse(localStorage.getItem("notifications") || "{}");
    if (!notifications[courseId]) notifications[courseId] = [];
    notifications[courseId].push(`New file uploaded: ${fileData.name}`);
    localStorage.setItem("notifications", JSON.stringify(notifications));

    if (Notification.permission === "granted") {
      new Notification("File Uploaded", { body: fileData.name });
    }
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <button onClick={handleUpload} className="btn-primary">Upload</button>
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <strong>Uploaded Files:</strong>
          <ul>
            {uploadedFiles.map((file, idx) => (
              <li key={idx}>{file.name} - {file.size} bytes - {file.date}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [createdCourses, setCreatedCourses] = useState(() => JSON.parse(localStorage.getItem("facultyCourses")) || []);
  const [newCourse, setNewCourse] = useState({ name: "", code: "", semester: 1, credits: 3 });
  const [facultyProfile, setFacultyProfile] = useState(() => JSON.parse(localStorage.getItem("facultyProfile")) || {
    name: "Dr. Rakshitha S",
    email: "rakshitha@university.edu",
    department: "CSE",
  });
  const [editProfile, setEditProfile] = useState(false);
  const [analytics, setAnalytics] = useState([
    { name: "Physics", enrollments: 60 },
    { name: "Chemistry", enrollments: 55 },
    { name: "Mathematics", enrollments: 65 },
    { name: "Biology", enrollments: 50 },
    { name: "English", enrollments: 70 },
  ]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const allNotifs = JSON.parse(localStorage.getItem("notifications") || "{}");
    const notifs = Object.values(allNotifs).flat();
    setNotifications(notifs);
  }, [createdCourses]);

  const handleCreateCourse = (e) => {
    e.preventDefault();
    const course = { ...newCourse, id: Date.now(), enrolled: 0 };
    const updated = [...createdCourses, course];
    setCreatedCourses(updated);
    localStorage.setItem("facultyCourses", JSON.stringify(updated));

    const notifData = JSON.parse(localStorage.getItem("notifications") || "{}");
    notifData[course.id] = [`New course added: ${course.name}`];
    localStorage.setItem("notifications", JSON.stringify(notifData));

    setNewCourse({ name: "", code: "", semester: 1, credits: 3 });
  };

  const handleDeleteCourse = (id) => {
    const updated = createdCourses.filter(c => c.id !== id);
    setCreatedCourses(updated);
    localStorage.setItem("facultyCourses", JSON.stringify(updated));
  };

  const handleSaveProfile = () => {
    localStorage.setItem("facultyProfile", JSON.stringify(facultyProfile));
    setEditProfile(false);
  };

  const handleLogout = () => window.location.href = "/";

  return (
    <div className="dashboard">
      <nav className="navbar">
        <ul>
                  <div className="brand"><h2>Faculty Portal</h2></div>
                  
                    <li onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "active" : ""}><Book /> <span>Dashboard</span></li>
                    
          <li onClick={() => setActiveTab("courses")} className={activeTab === "courses" ? "active" : ""}><Plus /> Courses</li>
          <li onClick={() => setActiveTab("uploads")} className={activeTab === "uploads" ? "active" : ""}><Upload /> Uploads</li>
          <li onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active" : ""}><User /> Profile</li>
          <li onClick={handleLogout}><LogOut /> Logout</li>
        </ul>
      </nav>

      <div className="content animate-card">
        {/* Dashboard Analytics */}
        {activeTab === "dashboard" && (
          <div>
            <h2>Welcome, {facultyProfile.name}</h2>
            <div className="analytics-grid">
              {analytics.map((item, idx) => (
                <div key={idx} className="analytics-card">
                  <h3>{item.name}</h3>
                  <p>{item.enrollments} Students</p>
                </div>
              ))}
            </div>

            <h3>Enrollment Analytics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrollments" fill="#1e3a8a" />
              </BarChart>
            </ResponsiveContainer>

            <h3>Notifications</h3>
            <ul className="notifications">
              {notifications.length === 0 ? <li>No notifications yet</li> :
                notifications.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        )}

        {/* Courses Section */}
        {activeTab === "courses" && (
          <div>
            <h2>Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="course-form">
              <input type="text" placeholder="Course Name" value={newCourse.name} onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} required />
              <input type="text" placeholder="Course Code" value={newCourse.code} onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })} required />
              <input type="number" placeholder="PUC" value={newCourse.semester} onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })} required />
              <input type="number" placeholder="Credits" value={newCourse.credits} onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })} required />
              <button type="submit" className="btn-primary">Create</button>
            </form>

            <h3>Created Courses</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th><th>Code</th><th>PUC</th><th>Credits</th><th>Enrolled</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {createdCourses.map(course => (
                  <tr key={course.id}>
                    <td>{course.name}</td>
                    <td>{course.code}</td>
                    <td>{course.semester}</td>
                    <td>{course.credits}</td>
                    <td>{course.enrolled}</td>
                    <td>
                      <button className="btn-delete" onClick={() => handleDeleteCourse(course.id)}><Trash /> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Upload Section */}
        {activeTab === "uploads" && (
          <div>
            <h2>Upload Resources</h2>
            {createdCourses.length === 0 ? <p>Create a course first.</p> :
              <div className="upload-cards">
                {createdCourses.map(course => (
                  <div key={course.id} className="upload-card">
                    <h4>{course.name}</h4>
                    <FileUpload courseId={course.id} />
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {/* Profile Section */}
        {activeTab === "profile" && (
          <div className="profile-card">
            <h2>Faculty Profile</h2>
            {editProfile ? (
              <div className="profile-edit">
                <label>Name:</label>
                <input type="text" value={facultyProfile.name} onChange={(e) => setFacultyProfile({ ...facultyProfile, name: e.target.value })} />
                <label>Email:</label>
                <input type="email" value={facultyProfile.email} onChange={(e) => setFacultyProfile({ ...facultyProfile, email: e.target.value })} />
                <label>Department:</label>
                <input type="text" value={facultyProfile.department} onChange={(e) => setFacultyProfile({ ...facultyProfile, department: e.target.value })} />
                <button className="btn-primary" onClick={handleSaveProfile}><Save /> Save Profile</button>
              </div>
            ) : (
              <div className="profile-view">
                <p><strong>Name:</strong> {facultyProfile.name}</p>
                <p><strong>Email:</strong> {facultyProfile.email}</p>
                <p><strong>Department:</strong> {facultyProfile.department}</p>
                <button className="btn-primary" onClick={() => setEditProfile(true)}><Edit /> Edit Profile</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        .dashboard { padding-left: 220px; font-family: 'Poppins', sans-serif; background: #f5f7fa; min-height: 100vh; transition: all 0.3s ease; }
        .navbar { position: fixed; top: 0; left: 0; width: 220px; height: 100vh; background: linear-gradient(180deg, #afdef9ff, #2469d8ff); padding: 30px 18px; display: flex; flex-direction: column; gap: 16px; box-shadow: 4px 0 20px rgba(0,0,0,0.12); }
        .navbar ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 16px; }
        .navbar li { color: #131111; display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; cursor: pointer; transition: all 0.3s ease; font-size: 15px; }
        .navbar li:hover, .navbar li.active { background: rgba(13, 11, 11, 0.1); color: #373232; transform: translateX(6px); }
        .content { margin-left: 240px; padding: 30px; transition: all 0.3s ease; }
        .animate-card { animation: fadeIn 0.7s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* Analytics Cards */
        .analytics-grid { display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
        .analytics-card { background: #ecefefff; padding: 20px; border-radius: 12px; box-shadow: 0 12px 30px rgba(2,6,23,0.08); flex: 1 1 180px; text-align: center; transition: all 0.3s ease; }
        .analytics-card:hover { transform: translateY(-5px); box-shadow: 0 18px 35px rgba(170, 171, 176, 0.12); }
        .analytics-card h3 { font-size: 16px; margin-bottom: 6px; color: #232325ff; }

        .analytics-card p { font-size: 14px; font-weight: 600; color: #2f2d2dff; }

        /* Course Table */
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
        .table th, .table td { padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; }
        .table th { background: #dff2f4ff; font-weight: 600; }
        .table tr:hover { background: #e4f8f9ff; }

        /* Buttons */
        .btn-primary { background: #2563eb; color: white; padding: 8px 12px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; transition: all 0.3s ease; }
        .btn-primary:hover { background: #3b82f6; transform: translateY(-2px); }
        .btn-delete { background: #ef4444; color: white; padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
        .btn-delete:hover { background: #f87171; }

        /* Upload Cards */
        .upload-cards { display: flex; flex-wrap: wrap; gap: 20px; }
        .upload-card { background: #ecf1f1ff; padding: 15px 20px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); flex: 1 1 300px; transition: all 0.3s ease; }
        .upload-card:hover { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(0,0,0,0.12); }

        /* Profile */
        .profile-card { background: #ecf1f1ff; padding: 20px; border-radius: 14px; box-shadow: 0 12px 25px rgba(0,0,0,0.08); max-width: 500px; margin-top: 20px; }
        .profile-edit label { display: block; margin-top: 12px; margin-bottom: 4px; font-weight: 500; }
        .profile-edit input { width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 12px; font-size: 14px; }
        .profile-view p { font-size: 14px; margin-bottom: 10px; }
        .notifications { list-style: disc; padding-left: 20px; margin-top: 10px; }
        .notifications li { margin-bottom: 8px; font-size: 14px; color: #1f2937; transition: all 0.2s ease; }
        .notifications li:hover { color: #2563eb; }

        .file-upload { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .uploaded-files ul { list-style: disc; margin-left: 20px; margin-top: 6px; }
        
        @media (max-width: 900px) { .dashboard { padding-left: 0; } .navbar { width: 100%; height: auto; flex-direction: row; overflow-x: auto; } .content { margin-left: 0; padding: 20px; } }
      `}</style>
    </div>
  );
};

export default FacultyDashboard;
