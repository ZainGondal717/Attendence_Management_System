import React, { useState } from 'react';
import { validationAPI } from '../services/api';

function Validation() {
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateAll = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await validationAPI.validateAll();
      setValidationResult(response.data.data);
    } catch (err) {
      setError('Failed to validate blockchain');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (valid) => {
    return valid ? '#28a745' : '#dc3545';
  };

  return (
    <div>
      <div className="card">
        <h2>✅ Blockchain Validation</h2>
        {error && <div className="error">{error}</div>}

        <p>
          This validation checks the integrity of all three blockchain layers:
          departments, classes, and students. Any tampering will be detected
          through hash mismatch or broken chain links.
        </p>

        <button 
          className="btn btn-primary" 
          onClick={validateAll}
          disabled={loading}
        >
          {loading ? 'Validating...' : '🔍 Validate Entire Blockchain System'}
        </button>

        {validationResult && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{
              padding: '1.5rem',
              borderRadius: '10px',
              background: validationResult.valid ? '#d4edda' : '#f8d7da',
              color: validationResult.valid ? '#155724' : '#721c24',
              marginBottom: '2rem',
              textAlign: 'center',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              {validationResult.valid ? '✅ ALL BLOCKCHAINS ARE VALID' : '❌ VALIDATION FAILED'}
            </div>

            {validationResult.errors.length > 0 && (
              <div className="error">
                <h3>Errors Found:</h3>
                <ul>
                  {validationResult.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid">
              <div className="card" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <h3>🏢 Department Chains</h3>
                <p style={{ fontSize: '2rem', margin: '1rem 0' }}>
                  {validationResult.departments.filter(d => d.valid).length} / {validationResult.departments.length}
                </p>
                <p>Valid Chains</p>
              </div>

              <div className="card" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <h3>📚 Class Chains</h3>
                <p style={{ fontSize: '2rem', margin: '1rem 0' }}>
                  {validationResult.classes.filter(c => c.valid).length} / {validationResult.classes.length}
                </p>
                <p>Valid Chains</p>
              </div>

              <div className="card" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <h3>👨‍🎓 Student Chains</h3>
                <p style={{ fontSize: '2rem', margin: '1rem 0' }}>
                  {validationResult.students.filter(s => s.valid).length} / {validationResult.students.length}
                </p>
                <p>Valid Chains</p>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h3>Detailed Validation Results</h3>
              
              <details>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', padding: '0.5rem' }}>
                  Department Chains ({validationResult.departments.length})
                </summary>
                <table>
                  <thead>
                    <tr>
                      <th>Department ID</th>
                      <th>Status</th>
                      <th>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationResult.departments.map((dept, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {dept.departmentId.substring(0, 8)}...
                        </td>
                        <td>
                          <span style={{ 
                            color: getStatusColor(dept.valid),
                            fontWeight: 'bold'
                          }}>
                            {dept.valid ? '✅ Valid' : '❌ Invalid'}
                          </span>
                        </td>
                        <td>{dept.error || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>

              <details style={{ marginTop: '1rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', padding: '0.5rem' }}>
                  Class Chains ({validationResult.classes.length})
                </summary>
                <table>
                  <thead>
                    <tr>
                      <th>Class ID</th>
                      <th>Status</th>
                      <th>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationResult.classes.map((cls, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {cls.classId.substring(0, 8)}...
                        </td>
                        <td>
                          <span style={{ 
                            color: getStatusColor(cls.valid),
                            fontWeight: 'bold'
                          }}>
                            {cls.valid ? '✅ Valid' : '❌ Invalid'}
                          </span>
                        </td>
                        <td>{cls.error || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>

              <details style={{ marginTop: '1rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', padding: '0.5rem' }}>
                  Student Chains ({validationResult.students.length})
                </summary>
                <table>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Status</th>
                      <th>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationResult.students.map((student, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {student.studentId.substring(0, 8)}...
                        </td>
                        <td>
                          <span style={{ 
                            color: getStatusColor(student.valid),
                            fontWeight: 'bold'
                          }}>
                            {student.valid ? '✅ Valid' : '❌ Invalid'}
                          </span>
                        </td>
                        <td>{student.error || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>ℹ️ Validation Information</h2>
        <h3>What is validated?</h3>
        <ul>
          <li><strong>Hash Integrity:</strong> Each block's hash is recalculated and verified</li>
          <li><strong>Chain Continuity:</strong> Each block's prev_hash matches the previous block's hash</li>
          <li><strong>Proof of Work:</strong> All hashes start with required difficulty (4 zeros)</li>
          <li><strong>Parent-Child Links:</strong> Class genesis blocks link to department chains</li>
          <li><strong>Hierarchical Integrity:</strong> Student genesis blocks link to class chains</li>
        </ul>

        <h3>Why validate?</h3>
        <p>
          Blockchain validation ensures that no data has been tampered with. Any modification
          to a block will break the chain and invalidate all dependent chains. This hierarchical
          structure means:
        </p>
        <ul>
          <li>Tampering with a department block invalidates all its classes and students</li>
          <li>Tampering with a class block invalidates all its students</li>
          <li>Tampering with a student block invalidates only that student's attendance</li>
        </ul>
      </div>
    </div>
  );
}

export default Validation;
