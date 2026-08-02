import React, { useState, useEffect } from 'react';
import { X, CheckSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TaskModal = ({ isOpen, onClose, onSubmit, projects = [], employees = [], initialData = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    taskTitle: '',
    taskDescription: '',
    projectId: '',
    assignedTo: '',
    priority: 'Medium',
    status: 'Pending',
    startDate: '',
    dueDate: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        taskTitle: initialData.taskTitle || '',
        taskDescription: initialData.taskDescription || '',
        projectId: initialData.projectId || (projects[0]?.projectId || ''),
        assignedTo: initialData.assignedTo || (employees[0]?.userId || ''),
        priority: initialData.priority || 'Medium',
        status: initialData.status || 'Pending',
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : ''
      });
    } else {
      setFormData({
        taskTitle: '',
        taskDescription: '',
        projectId: projects[0]?.projectId || '',
        assignedTo: employees[0]?.userId || '',
        priority: 'Medium',
        status: 'Pending',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
      });
    }
    setError('');
  }, [initialData, isOpen, projects, employees]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.taskTitle.trim()) {
      setError('Task Title is required.');
      return;
    }
    if (new Date(formData.dueDate) < new Date(formData.startDate)) {
      setError('Due Date cannot be earlier than Start Date.');
      return;
    }

    onSubmit({
      ...formData,
      projectId: Number(formData.projectId) || (projects[0]?.projectId || 1),
      assignedTo: Number(formData.assignedTo) || (employees[0]?.userId || 3),
      assignedBy: user ? user.userId : 1
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '1.5rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare size={20} color="#4f46e5" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
              {initialData ? 'Edit Task' : 'Create New Task'}
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
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Task Title</label>
            <input
              type="text"
              className="glass-input"
              style={{ width: '100%' }}
              placeholder="e.g. Implement OAuth Endpoint"
              value={formData.taskTitle}
              onChange={(e) => setFormData({ ...formData, taskTitle: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Description</label>
            <textarea
              className="glass-input"
              style={{ width: '100%', minHeight: '75px', resize: 'vertical' }}
              placeholder="Task instructions and requirements..."
              value={formData.taskDescription}
              onChange={(e) => setFormData({ ...formData, taskDescription: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Project</label>
              <select
                className="glass-input"
                style={{ width: '100%', cursor: 'pointer' }}
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              >
                {projects.map(p => (
                  <option key={p.projectId} value={p.projectId}>{p.projectName}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Assignee</label>
              <select
                className="glass-input"
                style={{ width: '100%', cursor: 'pointer' }}
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              >
                {employees.map(emp => (
                  <option key={emp.userId} value={emp.userId}>{emp.fullName}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Priority</label>
              <select
                className="glass-input"
                style={{ width: '100%', cursor: 'pointer' }}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Status</label>
              <select
                className="glass-input"
                style={{ width: '100%', cursor: 'pointer' }}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
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
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Due Date</label>
              <input
                type="date"
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" className="gradient-button">
              {initialData ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
