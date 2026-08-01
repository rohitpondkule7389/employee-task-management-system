import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import { DonutChartCard } from '../components/DonutChartCard';
import { fetchEmployeeDashboard, fetchEmployeeTasks, updateTaskStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const EmployeeDashboard = ({ onNavigateToKanban, onOpenComments }) => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEmployeeData();
    }
  }, [user]);

  const loadEmployeeData = async () => {
    setLoading(true);
    try {
      const empId = user ? user.userId : 3;
      const [dashRes, tasksRes] = await Promise.all([
        fetchEmployeeDashboard(empId),
        fetchEmployeeTasks(empId)
      ]);
      setDashboard(dashRes);
      setMyTasks(tasksRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setMyTasks(prev => prev.map(t => t.taskId === taskId ? { ...t, status: newStatus } : t));
      loadEmployeeData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: '#64748b', padding: '2rem' }}>Loading Workspace...</div>;

  const personalTaskDonut = [
    { name: 'Pending', value: dashboard?.pendingTasks || 0, color: '#d97706' },
    { name: 'In Progress', value: dashboard?.inProgressTasks || 0, color: '#0284c7' },
    { name: 'Completed', value: dashboard?.completedTasks || 0, color: '#059669' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>My Total Tasks</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>{dashboard?.myTasks || myTasks.length}</div>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Pending / In Progress</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
              {(dashboard?.pendingTasks || 0) + (dashboard?.inProgressTasks || 0)}
            </div>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#047857' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Completed Tasks</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>{dashboard?.completedTasks || 0}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: My Task Donut & Assigned Task List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        <DonutChartCard
          title="My Personal Task Progress"
          subtitle="Status distribution of tasks assigned to you"
          data={personalTaskDonut}
          centerLabel="Assigned"
          centerValue={dashboard?.myTasks || myTasks.length}
          colors={['#d97706', '#0284c7', '#059669']}
        />

        {/* Actionable Assigned Task List */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>Assigned Task Quick Actions</h3>
            <button 
              onClick={() => onNavigateToKanban && onNavigateToKanban()}
              style={{ background: 'transparent', border: 'none', color: '#4f46e5', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Open Kanban <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, overflowY: 'auto' }}>
            {myTasks.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
                No assigned tasks currently.
              </p>
            ) : (
              myTasks.map(t => (
                <div
                  key={t.taskId}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{t.taskTitle}</h4>
                    <select
                      className="glass-input"
                      style={{ padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
                      value={t.status}
                      onChange={(e) => handleQuickStatusChange(t.taskId, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#475569' }}>{t.taskDescription}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <button
                      onClick={() => onOpenComments && onOpenComments(t)}
                      style={{ background: 'transparent', border: 'none', color: '#4f46e5', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <MessageSquare size={13} /> Discuss Comments
                    </button>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};