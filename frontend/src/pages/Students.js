import React, { useState, useEffect } from 'react';
import { studentAPI, classAPI, departmentAPI } from '../services/api';

function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    rollNumber: '', 
    classId: '', 
    departmentId: '' 
  });
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.create(formData);
      setSuccess('Student created successfully!');
      setFormData({ name: '', rollNumber: '', classId: '', departmentId: '' });
      setShowForm(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create student');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student? A deletion block will be added.')) return;
    try {
      await studentAPI.delete(id);
      setSuccess('Student deleted (deletion block added)');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete student');
    }
  };

  const viewBlockchain = async (id) => {
    try {
      const response = await studentAPI.getById(id);
      setSelectedStudent(response.data.data);
    } catch (err) {
      setError('Failed to load blockchain');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="card">
        <h2>👨‍🎓 Students (Layer 3 Blockchain)</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Student'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>Department</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value, classId: '' })}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Class</label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                required
                disabled={!formData.departmentId}
              >
                <option value="">Select Class</option>
                {classes
                  .filter(c => c.departmentId === formData.departmentId)
                  .map((cls) => (
                    <option key={cls.classId} value={cls.classId}>
                      {cls.className}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group">
              <label>Student Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., John Doe"
              />
            </div>
            <div className="form-group">
              <label>Roll Number</label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                required
                placeholder="e.g., 2021-CS-001"
              />
            </div>
            <button type="submit" className="btn btn-success">Create Student</button>
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Class</th>
              <th>Department</th>
              <th>Status</th>
              <th>Blocks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const cls = classes.find(c => c.classId === student.classId);
              const dept = departments.find(d => d.departmentId === student.departmentId);
              return (
                <tr key={student.studentId}>
                  <td>{student.studentName}</td>
                  <td>{student.rollNumber}</td>
                  <td>{cls?.className || 'N/A'}</td>
                  <td>{dept?.departmentName || 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${student.status}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>{student.blockCount}</td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => viewBlockchain(student.studentId)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      View Chain
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(student.studentId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <div className="card">
          <h2>🔗 Blockchain for: {selectedStudent.studentName}</h2>
          <button className="btn btn-secondary" onClick={() => setSelectedStudent(null)}>
            Close
          </button>
          <div className="blockchain-chain">
            {selectedStudent.chain.map((block) => (
              <div key={block.index} className="block">
                <div className="block-header">
                  <span>Block #{block.index}</span>
                  <span>Nonce: {block.nonce}</span>
                </div>
                <div className="block-data">
                  <strong>Type:</strong> {block.transactions.type}<br />
                  <strong>Timestamp:</strong> {new Date(block.timestamp).toLocaleString()}<br />
                  {block.transactions.studentName && (
                    <><strong>Name:</strong> {block.transactions.studentName}<br /></>
                  )}
                  {block.transactions.rollNumber && (
                    <><strong>Roll:</strong> {block.transactions.rollNumber}<br /></>
                  )}
                  {block.transactions.status && block.transactions.type === 'ATTENDANCE' && (
                    <><strong>Attendance:</strong> <span className={`status-badge status-${block.transactions.status.toLowerCase()}`}>{block.transactions.status}</span><br /></>
                  )}
                  {block.transactions.date && (
                    <><strong>Date:</strong> {block.transactions.date}<br /></>
                  )}
                  {block.transactions.parentClassHash && (
                    <><strong>Parent Class Hash:</strong> {block.transactions.parentClassHash.substring(0, 20)}...<br /></>
                  )}
                </div>
                <div className="hash-display">
                  <strong>Hash:</strong> {block.hash}<br />
                  <strong>Prev Hash:</strong> {block.prev_hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
