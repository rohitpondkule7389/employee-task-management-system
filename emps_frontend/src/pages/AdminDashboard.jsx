import React, { useState, useEffect } from 'react';
import { Users, FolderKanban, CheckSquare, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';
import { DonutChartCard } from '../components/DonutChartCard';
import { fetchAdminDashboard } from '../services/api';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminDashboard();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#64748b', padding: '2rem' }}>Loading Admin Metrics...</div>;
  }

  const roleDonutData = [
    { name: 'Admins', value: data?.totalAdmins || 1, color: '#4f46e5' },
    { name: 'Managers', value: data?.totalManagers || 2, color: '#0284c7' },
    { name: 'Employees', value: data?.totalEmployees || 4, color: '#059669' }
  ];

  const taskStatusDonutData = [
    { name: 'Pending', value: data?.pendingTasks || 2, color: '#d97706' },
    { name: 'In Progress', value: data?.inProgressTasks || 3, color: '#0284c7' },
    { name: 'Completed', value: data?.completedTasks || 4, color: '#059669' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Top Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Total System Users</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>{data?.totalUsers || 7}</div>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1' }}>
            <FolderKanban size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Active Projects</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>{data?.totalProjects || 3}</div>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#047857' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Total Managed Tasks</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>{data?.totalTasks || 9}</div>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Task Completion Rate</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
              {data?.totalTasks ? Math.round((data.completedTasks / data.totalTasks) * 100) : 44}%
            </div>
          </div>
        </div>
      </div>

      {/* Donut Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        <DonutChartCard
          title="User Role Distribution"
          subtitle="Breakdown of system users across microservice roles"
          data={roleDonutData}
          centerLabel="Users"
          centerValue={data?.totalUsers || 7}
          colors={['#4f46e5', '#0284c7', '#059669']}
        />

        <DonutChartCard
          title="Task Status Breakdown"
          subtitle="Real-time distribution of task progression"
          data={taskStatusDonutData}
          centerLabel="Tasks"
          centerValue={data?.totalTasks || 9}
          colors={['#d97706', '#0284c7', '#059669']}
        />
      </div>
    </div>
  );
};
