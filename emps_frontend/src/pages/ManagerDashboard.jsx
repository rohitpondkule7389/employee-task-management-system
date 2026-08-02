import React, { useState, useEffect } from 'react';
import { Briefcase, FolderKanban, CheckSquare, Users, ArrowRight } from 'lucide-react';
import { DonutChartCard } from '../components/DonutChartCard';
import { fetchManagerDashboard, fetchProjects } from '../services/api';

export const ManagerDashboard = ({ onNavigateToProjects, onNavigateToTasks }) => {
  const [metrics, setMetrics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [mRes, pRes] = await Promise.all([
        fetchManagerDashboard(),
        fetchProjects()
      ]);
      setMetrics(mRes);
      setProjects(pRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ color: '#64748b', padding: '2rem' }}>Loading Manager Portal...</div>;

  const taskStatusDonut = [
    { name: 'Pending', value: metrics?.pendingTasks || 3, color: '#d97706' },
    { name: 'In Progress', value: metrics?.inProgressTasks || 4, color: '#0284c7' },
    { name: 'Completed', value: metrics?.completedTasks || 5, color: '#059669' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Metric Cards Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca' }}>
            <FolderKanban size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Managed Projects</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>{metrics?.totalProjects || projects.length}</div>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Team Employees</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>{metrics?.totalEmployees || 4}</div>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#047857' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Total Project Tasks</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>{metrics?.totalTasks || 12}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects Overview + Task Status Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        <DonutChartCard
          title="Project Task Status Distribution"
          subtitle="Real-time task completion breakdown for team projects"
          data={taskStatusDonut}
          centerLabel="Tasks"
          centerValue={metrics?.totalTasks || 12}
          colors={['#d97706', '#0284c7', '#059669']}
        />

        {/* Managed Projects Overview Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>Active Projects Summary</h3>
            <button 
              onClick={() => onNavigateToProjects && onNavigateToProjects()}
              style={{ background: 'transparent', border: 'none', color: '#4f46e5', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
            {projects.slice(0, 4).map(p => (
              <div 
                key={p.projectId}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{p.projectName}</h4>
                  <span className="badge badge-inprogress">Active</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', lineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>
                  <span>Start: {p.startDate ? new Date(p.startDate).toLocaleDateString() : 'N/A'}</span>
                  <span>End: {p.endDate ? new Date(p.endDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
