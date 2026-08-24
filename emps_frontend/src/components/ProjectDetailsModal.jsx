import React, { useState, useEffect } from 'react';
import { X, FolderKanban, Calendar, UserCheck, Users, CheckSquare, Clock } from 'lucide-react';
import { fetchProjectEmployeeDetails, fetchTasks, getUserName } from '../services/api';

export const ProjectDetailsModal = ({ project, isOpen, onClose }) => {
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (project) {
      loadProjectDetails();
    }
  }, [project]);

  const loadProjectDetails = async () => {
    if (!project) return;
    setLoading(true);
    try {
      const [empDetails, allTasks] = await Promise.all([
        fetchProjectEmployeeDetails(project.projectId),
        fetchTasks()
      ]);
      setAssignedEmployees(empDetails);
      const filteredTasks = allTasks.filter(t => Number(t.projectId) === Number(project.projectId));
      setProjectTasks(filteredTasks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = projectTasks.filter(t => t.status === 'Pending').length;
  const inProgressTasks = projectTasks.filter(t => t.status === 'In Progress').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const managerName = getUserName(project.managerId);

  return (
    <div className="modal-backdrop">
      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.75rem',
          background: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          overflowY: 'auto',
          borderRadius: '20px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <FolderKanban size={24} color="#4f46e5" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>{project.projectName}</h2>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#475569' }}>{project.description}</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Project Meta Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <UserCheck size={14} color="#0284c7" /> Assigned Manager
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>{managerName}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} color="#4f46e5" /> Timeline
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
              {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>

        {/* Progress Bar & Task Statistics */}
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>Project Progress</span>
            <strong style={{ fontSize: '1rem', color: '#4f46e5', fontWeight: '800' }}>{progressPercent}% Completed</strong>
          </div>

          {/* Custom Bar */}
          <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5, #059669)', transition: 'width 0.4s' }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{totalTasks}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Total Tasks</div>
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#d97706' }}>{pendingTasks}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Pending</div>
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0284c7' }}>{inProgressTasks}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>In Progress</div>
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>{completedTasks}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Completed</div>
            </div>
          </div>
        </div>

        {/* Assigned Employees */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} color="#4f46e5" /> Assigned Team Employees ({assignedEmployees.length})
          </h4>
          {loading ? (
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Loading employees...</p>
          ) : assignedEmployees.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No team members assigned yet.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {assignedEmployees.map(emp => (
                <div key={emp.userId} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '20px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#4f46e5', color: '#fff', fontSize: '0.72rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {emp.fullName.charAt(0)}
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a' }}>{emp.fullName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Project Tasks List */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckSquare size={16} color="#4f46e5" /> Tasks List ({projectTasks.length})
          </h4>
          {projectTasks.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No tasks created for this project.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {projectTasks.map(t => (
                <div key={t.taskId} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h5 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>{t.taskTitle}</h5>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned to: {getUserName(t.assignedTo)}</span>
                  </div>
                  <span className={`badge badge-${t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'inprogress' : 'pending'}`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
