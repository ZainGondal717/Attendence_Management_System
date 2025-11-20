import React, { useState, useEffect } from 'react';
import { departmentAPI } from '../services/api';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getAll();
      setDepartments(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load departments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await departmentAPI.create(formData);
      setSuccess('Department created successfully!');
      setFormData({ name: '' });
      setShowForm(false);
      loadDepartments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create department');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will add a deletion block to the chain.')) return;
    try {
      await departmentAPI.delete(id);
      setSuccess('Department deleted (deletion block added)');
      loadDepartments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete department');
    }
  };

  const viewBlockchain = async (id) => {
    try {
      const response = await departmentAPI.getById(id);
      setSelectedDept(response.data.data);
    } catch (err) {
      setError('Failed to load blockchain');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="card">
        <h2>🏢 Departments (Layer 1 Blockchain)</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Department'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>Department Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                required
                placeholder="e.g., School of Computing"
              />
            </div>
            <button type="submit" className="btn btn-success">Create Department</button>
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Status</th>
              <th>Blocks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.departmentId}>
                <td>{dept.departmentName}</td>
                <td>
                  <span className={`status-badge status-${dept.status}`}>
                    {dept.status}
                  </span>
                </td>
                <td>{dept.blockCount}</td>
                <td>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => viewBlockchain(dept.departmentId)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    View Chain
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(dept.departmentId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDept && (
        <div className="card">
          <h2>🔗 Blockchain for: {selectedDept.departmentName}</h2>
          <button className="btn btn-secondary" onClick={() => setSelectedDept(null)}>
            Close
          </button>
          <div className="blockchain-chain">
            {selectedDept.chain.map((block) => (
              <div key={block.index} className="block">
                <div className="block-header">
                  <span>Block #{block.index}</span>
                  <span>Nonce: {block.nonce}</span>
                </div>
                <div className="block-data">
                  <strong>Type:</strong> {block.transactions.type}<br />
                  <strong>Timestamp:</strong> {new Date(block.timestamp).toLocaleString()}<br />
                  {block.transactions.departmentName && (
                    <><strong>Name:</strong> {block.transactions.departmentName}<br /></>
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

export default Departments;
