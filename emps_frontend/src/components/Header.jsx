import React from 'react';
import { Bell, Shield, Briefcase, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = ({ activeTab }) => {
  const { user } = useAuth();

  const getBreadcrumbTitle = (tab) => {
    switch (tab) {
      case 'dashboard': return `${user?.role || 'User'} Dashboard`;
      case 'projects': return 'Project Workspace';
      case 'tasks': return 'Task & Kanban Overview';
      case 'users': return 'System User Directory';
      default: return 'Project Management System';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin': return <span className="badge badge-urgent"><Shield size={13} /> Admin Portal</span>;
      case 'Manager': return <span className="badge badge-inprogress"><Briefcase size={13} /> Manager Portal</span>;
      default: return <span className="badge badge-completed"><UserCheck size={13} /> Employee Portal</span>;
    }
  };

  return (
    <header 
      className="glass-panel"
      style={{
        padding: '0.85rem 1.5rem',
        margin: '1rem 1rem 0 1rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        zIndex: 40,
        background: '#ffffff'
      }}
    >
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
          {getBreadcrumbTitle(activeTab)}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#059669' }}></span>
          <span>API Gateway connected (`http://localhost:7000`)</span>
        </div>
      </div>

      {/* Right Section: Active User Role Indicator & Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {getRoleBadge(user?.role)}

        {/* Notifications Icon */}
        <div style={{
          position: 'relative',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          color: '#64748b',
          cursor: 'pointer'
        }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#e11d48'
          }}></span>
        </div>
      </div>
    </header>
  );
};
