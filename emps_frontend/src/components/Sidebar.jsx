import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  User,
  LogOut, 
  ShieldCheck, 
  Briefcase, 
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin': return <ShieldCheck size={16} color="#4f46e5" />;
      case 'Manager': return <Briefcase size={16} color="#0284c7" />;
      default: return <UserCheck size={16} color="#059669" />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['Admin', 'Manager', 'Employee'] },
    { id: 'projects', label: 'Projects', icon: <FolderKanban size={18} />, roles: ['Admin', 'Manager', 'Employee'] },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={18} />, roles: ['Admin', 'Manager', 'Employee'] },
    { id: 'users', label: 'User Directory', icon: <Users size={18} />, roles: ['Admin'] },
    { id: 'profile', label: 'Profile', icon: <User size={18} />, roles: ['Admin', 'Manager', 'Employee'] },
  ];

  const allowedNav = navItems.filter(item => !item.roles || item.roles.includes(user?.role || 'Admin'));

  return (
    <motion.aside 
      animate={{ width: collapsed ? '80px' : '260px' }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="glass-panel"
      style={{
        height: 'calc(100vh - 2rem)',
        position: 'sticky',
        top: '1rem',
        margin: '1rem 0 1rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        padding: collapsed ? '1.25rem 0.75rem' : '1.25rem',
        zIndex: 50,
        background: '#ffffff',
        overflow: 'hidden'
      }}
    >
      <div>
        {/* Brand Logo & Collapse Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: '0.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
              flexShrink: 0
            }}>
              <FolderKanban size={22} color="#fff" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="gradient-text" style={{ fontSize: '1.15rem', fontWeight: '800', lineHeight: '1.1' }}>
                  TaskFlow Pro
                </h1>
                <span style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.05em', fontWeight: '600' }}>SAAS PLATFORM</span>
              </div>
            )}
          </div>

          <button 
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#64748b', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User Card */}
        {!collapsed && (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '0.75rem 0.85rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#e0e7ff',
              border: '1px solid #c7d2fe',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              color: '#4338ca',
              fontWeight: '700',
              fontSize: '0.9rem',
              flexShrink: 0
            }}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || 'User'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#475569', fontWeight: '600' }}>
                {getRoleIcon(user?.role)}
                <span>{user?.role || 'Guest'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {allowedNav.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: collapsed ? 'center' : 'flex-start',
                  gap: '0.75rem',
                  padding: collapsed ? '0.7rem' : '0.7rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg, #e0e7ff, #f3e8ff)' : 'transparent',
                  color: isActive ? '#4338ca' : '#475569',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  borderLeft: (!collapsed && isActive) ? '3px solid #4f46e5' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        title={collapsed ? 'Logout Session' : ''}
        style={{
          display: 'flex',
          alignItems: 'center',
          justify: collapsed ? 'center' : 'flex-start',
          gap: '0.75rem',
          padding: collapsed ? '0.75rem' : '0.75rem 1rem',
          borderRadius: '10px',
          border: '1px solid #fecdd3',
          background: '#fff1f2',
          color: '#e11d48',
          fontWeight: '600',
          fontSize: '0.85rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginTop: '1rem'
        }}
      >
        <LogOut size={16} />
        {!collapsed && <span>Logout Session</span>}
      </button>
    </motion.aside>
  );
};
