import React, { useState, useEffect } from 'react';
import { attendanceAPI, studentAPI, classAPI, departmentAPI } from '../services/api';

function Attendance() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsRes, classesRes, deptsRes] = await Promise.all([
        studentAPI.getAll(),
        classAPI.getAll(),
        departmentAPI.getAll()
      ]);
      setStudents(studentsRes.data.data);
      setClasses(classesRes.data.data);
      setDepartments(deptsRes.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadClassAttendance = async () => {
    if (!selectedClass) return;
    try {
      const classStudents = students.filter(s => s.classId === selectedClass);
      const attendance = classStudents.map(student => ({
        studentId: student.studentId,
        studentName: student.studentName,
        rollNumber: student.rollNumber,
        status: 'Present' // Default
      }));
      setAttendanceData(attendance);
    } catch (err) {
      setError('Failed to load class attendance');
    }
  };

  useEffect(() => {
    if (selectedClass) {
      loadClassAttendance();
    }
  }, [selectedClass]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev =>
      prev.map(record =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const handleSubmitAttendance = async () => {
    try {
      const attendance = attendanceData.map(record => ({
        studentId: record.studentId,
        status: record.status,
        date: selectedDate
      }));

      await attendanceAPI.markBulk({ attendance });
      setSuccess(`Attendance marked successfully for ${attendance.length} students!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to mark attendance');
    }
  };

  const [viewMode, setViewMode] = useState('mark'); // 'mark' or 'view'
  const [viewData, setViewData] = useState(null);

  const viewStudentHistory = async (studentId) => {
    try {
      const response = await attendanceAPI.getStudentAttendance(studentId);
      setViewData(response.data.data);
      setViewMode('view');
    } catch (err) {
      setError('Failed to load attendance history');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="card">
        <h2>📝 Attendance Management</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div style={{ marginBottom: '1rem' }}>
          <button 
            className={`btn ${viewMode === 'mark' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('mark')}
            style={{ marginRight: '0.5rem' }}
          >
            Mark Attendance
          </button>
          <button 
            className={`btn ${viewMode === 'view' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('view')}
          >
            View History
          </button>
        </div>

        {viewMode === 'mark' && (
          <>
            <div className="form-group">
              <label>Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Choose a class...</option>
                {classes.map((cls) => {
                  const dept = departments.find(d => d.departmentId === cls.departmentId);
                  return (
                    <option key={cls.classId} value={cls.classId}>
                      {cls.className} - {dept?.departmentName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {attendanceData.length > 0 && (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Roll Number</th>
                      <th>Student Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((record) => (
                      <tr key={record.studentId}>
                        <td>{record.rollNumber}</td>
                        <td>{record.studentName}</td>
                        <td>
                          <select
                            value={record.status}
                            onChange={(e) => handleStatusChange(record.studentId, e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '5px' }}
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Leave">Leave</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button 
                  className="btn btn-success" 
                  onClick={handleSubmitAttendance}
                  style={{ marginTop: '1rem' }}
                >
                  Submit Attendance
                </button>
              </>
            )}
          </>
        )}

        {viewMode === 'view' && (
          <>
            <div className="form-group">
              <label>Select Student</label>
              <select onChange={(e) => e.target.value && viewStudentHistory(e.target.value)}>
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student.studentId} value={student.studentId}>
                    {student.studentName} - {student.rollNumber}
                  </option>
                ))}
              </select>
            </div>

            {viewData && (
              <div style={{ marginTop: '1rem' }}>
                <h3>Attendance History for {viewData.studentInfo.studentName}</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Block Index</th>
                      <th>Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewData.attendance.map((record) => (
                      <tr key={record.index}>
                        <td>{record.date}</td>
                        <td>
                          <span className={`status-badge status-${record.status.toLowerCase()}`}>
                            {record.status}
                          </span>
                        </td>
                        <td>#{record.index}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {record.hash.substring(0, 16)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Attendance;
