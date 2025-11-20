import React, { useState, useEffect } from 'react';
import { departmentAPI, classAPI, studentAPI, attendanceAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    departments: 0,
    classes: 0,
    students: 0,
    todayAttendance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [depts, classes, students, attendance] = await Promise.all([
        departmentAPI.getAll(),
        classAPI.getAll(),
        studentAPI.getAll(),
        attendanceAPI.getTodayAttendance()
      ]);

      setStats({
        departments: depts.data.data.length,
        classes: classes.data.data.length,
        students: students.data.data.length,
        todayAttendance: attendance.data.data.length
      });
      setError('');
    } catch (err) {
      setError('Failed to load statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="card">
        <h2>📊 Dashboard</h2>
        {error && <div className="error">{error}</div>}
        
        <div className="grid">
          <div className="stat-card">
            <h3>{stats.departments}</h3>
            <p>Departments</p>
          </div>
          <div className="stat-card">
            <h3>{stats.classes}</h3>
            <p>Classes</p>
          </div>
          <div className="stat-card">
            <h3>{stats.students}</h3>
            <p>Students</p>
          </div>
          <div className="stat-card">
            <h3>{stats.todayAttendance}</h3>
            <p>Today's Attendance</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>🔗 Blockchain Architecture</h2>
        <p>This system implements a 3-layer hierarchical blockchain structure:</p>
        <ul>
          <li><strong>Layer 1 - Department Blockchain:</strong> Independent chains for each department</li>
          <li><strong>Layer 2 - Class Blockchain:</strong> Child chains linked to department blocks</li>
          <li><strong>Layer 3 - Student Blockchain:</strong> Personal chains linked to class blocks with attendance records</li>
        </ul>
        <p>Each block is secured with SHA-256 hashing and Proof of Work (difficulty: 4 leading zeros).</p>
      </div>

      <div className="card">
        <h2>✨ Key Features</h2>
        <ul>
          <li>Immutable attendance records stored on blockchain</li>
          <li>Hierarchical chain validation (tampering detection cascades)</li>
          <li>Full CRUD operations with blockchain integrity</li>
          <li>Real-time attendance marking and tracking</li>
          <li>Complete blockchain history visualization</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
