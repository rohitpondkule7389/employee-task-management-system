import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { assignEmployeeToProject } from '../services/api';

export const AssignEmployeeModal = ({ isOpen, onClose, project, employees = [], onAssigned }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !project) return null;

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      setError('Please select an employee');
      return;
    }

    try {
      await assignEmployeeToProject(project.projectId, Number(selectedEmployeeId));
      setMessage('Employee assigned successfully!');
      setError('');
      if (onAssigned) onAssigned();
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 1200);
    } catch (err) {
      setError('Failed to assign employee or already assigned.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '1.5rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} color="#4f46e5" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>Assign Employee</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
          Assign team members to <strong style={{ color: '#0f172a' }}>{project.projectName}</strong>
        </p>

        {message && (
          <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#047857', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={15} /> {message}
          </div>
        )}

        {error && (
          <div style={{ background: '#ffe4e6', border: '1px solid #fecdd3', color: '#be123c', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Select Employee</label>
            <select
              className="glass-input"
              style={{ width: '100%', cursor: 'pointer' }}
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              required
            >
              <option value="">-- Choose Employee --</option>
              {employees.map(emp => (
                <option key={emp.userId} value={emp.userId}>{emp.fullName}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" className="gradient-button">
              Assign to Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
