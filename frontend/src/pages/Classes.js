import React, { useState, useEffect } from 'react';
import { classAPI, departmentAPI } from '../services/api';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', departmentId: '' });
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classesRes, deptsRes] = await Promise.all([
        classAPI.getAll(),
        departmentAPI.getAll()
      ]);
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
      await classAPI.create(formData);
      setSuccess('Class created successfully!');
      setFormData({ name: '', departmentId: '' });
      setShowForm(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create class');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class? A deletion block will be added.')) return;
    try {
      await classAPI.delete(id);
      setSuccess('Class deleted (deletion block added)');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete class');
    }
  };

  const viewBlockchain = async (id) => {
    try {
      const response = await classAPI.getById(id);
      setSelectedClass(response.data.data);
    } catch (err) {
      setError('Failed to load blockchain');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="card">
        <h2>📚 Classes (Layer 2 Blockchain)</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Class'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>Department</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
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
              <label>Class Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., CS-101-A"
              />
            </div>
            <button type="submit" className="btn btn-success">Create Class</button>
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Department</th>
              <th>Status</th>
              <th>Blocks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => {
              const dept = departments.find(d => d.departmentId === cls.departmentId);
              return (
                <tr key={cls.classId}>
                  <td>{cls.className}</td>
                  <td>{dept?.departmentName || 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${cls.status}`}>
                      {cls.status}
                    </span>
                  </td>
                  <td>{cls.blockCount}</td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => viewBlockchain(cls.classId)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      View Chain
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(cls.classId)}
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

      {selectedClass && (
        <div className="card">
          <h2>🔗 Blockchain for: {selectedClass.className}</h2>
          <button className="btn btn-secondary" onClick={() => setSelectedClass(null)}>
            Close
          </button>
          <div className="blockchain-chain">
            {selectedClass.chain.map((block) => (
              <div key={block.index} className="block">
                <div className="block-header">
                  <span>Block #{block.index}</span>
                  <span>Nonce: {block.nonce}</span>
                </div>
                <div className="block-data">
                  <strong>Type:</strong> {block.transactions.type}<br />
                  <strong>Timestamp:</strong> {new Date(block.timestamp).toLocaleString()}<br />
                  {block.transactions.className && (
                    <><strong>Name:</strong> {block.transactions.className}<br /></>
                  )}
                  {block.transactions.parentDepartmentHash && (
                    <><strong>Parent Dept Hash:</strong> {block.transactions.parentDepartmentHash.substring(0, 20)}...<br /></>
                  )}
                  <strong>Status:</strong> {block.transactions.status || 'N/A'}
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

export default Classes;
