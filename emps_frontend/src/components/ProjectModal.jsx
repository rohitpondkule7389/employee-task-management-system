import React, { useState, useEffect } from 'react';
import { X, FolderPlus, AlertCircle } from 'lucide-react';

export const ProjectModal = ({ isOpen, onClose, onSubmit, managers = [], initialData = null }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    managerId: ''
  });

  const [error, setError] = useState('');

  // Filter managers array to include ONLY users whose role is 'Manager'
  const managerOptions = managers.filter(m => m.role === 'Manager' || !m.role);

  useEffect(() => {
    if (initialData) {
      setFormData({
        projectName: initialData.projectName || '',
        description: initialData.description || '',
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
        endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
        managerId: initialData.managerId || (managerOptions[0]?.userId || '')
      });
    } else {
      setFormData({
        projectName: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        managerId: managerOptions[0]?.userId || ''
      });
    }
    setError('');
  }, [initialData, isOpen, managers]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.projectName.trim()) {
      setError('Project Name is required.');
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End Date cannot be earlier than Start Date.');
      return;
    }

    onSubmit({
      ...formData,
      managerId: Number(formData.managerId) || (managerOptions[0]?.userId || 2)
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '1.5rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderPlus size={20} color="#4f46e5" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
              {initialData ? 'Edit Project' : 'Create New Project'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: '#ffe4e6', border: '1px solid #fecdd3', color: '#be123c', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Project Name</label>
            <input
              type="text"
              className="glass-input"
              style={{ width: '100%' }}
              placeholder="e.g. Cloud Migration Core"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Description</label>
            <textarea
              className="glass-input"
              style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
              placeholder="Project goals and details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Start Date</label>
              <input
                type="date"
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>End Date</label>
              <input
                type="date"
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>
              Assign Manager (Role = Manager Only)
            </label>
            <select
              className="glass-input"
              style={{ width: '100%', cursor: 'pointer' }}
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
              required
            >
              {managerOptions.length > 0 ? (
                managerOptions.map(m => (
                  <option key={m.userId} value={m.userId}>{m.fullName} ({m.email})</option>
                ))
              ) : (
                <option value="2">Sarah Connor (Manager)</option>
              )}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" className="gradient-button">
              {initialData ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
