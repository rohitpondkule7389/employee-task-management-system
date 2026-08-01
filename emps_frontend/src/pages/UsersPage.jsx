import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Briefcase, UserCheck, X, Check, Eye, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { fetchUsers, registerUser, updateUser, deleteUser, fetchUserById } from '../services/api';

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  // Form State
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'Employee' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchUsers();
      setUsers(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      setErr('All fields are required.');
      return;
    }

    try {
      await registerUser(form.fullName, form.email, form.password, form.role);
      setMsg('User registered successfully!');
      setErr('');
      setForm({ fullName: '', email: '', password: '', role: 'Employee' });
      loadUsers();
      setTimeout(() => {
        setMsg('');
        setIsRegisterModalOpen(false);
      }, 1200);
    } catch (error) {
      setErr('Registration failed.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUser(editingUser.userId, {
        fullName: editingUser.fullName,
        email: editingUser.email,
        role: editingUser.role
      });
      setMsg('User updated successfully!');
      loadUsers();
      setTimeout(() => {
        setMsg('');
        setEditingUser(null);
      }, 1200);
    } catch (error) {
      setErr('Failed to update user.');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm(`Are you sure you want to remove user #${userId} from the system?`)) {
      try {
        await deleteUser(userId);
        setUsers(prev => prev.filter(u => u.userId !== userId));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleViewDetails = async (userId) => {
    const details = await fetchUserById(userId);
    setViewingUser(details || users.find(u => u.userId === userId));
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin': return <span className="badge badge-urgent"><Shield size={12} /> Admin</span>;
      case 'Manager': return <span className="badge badge-inprogress"><Briefcase size={12} /> Manager</span>;
      default: return <span className="badge badge-completed"><UserCheck size={12} /> Employee</span>;
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Top Header Controls */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: '#ffffff' }}>
        <input
          type="text"
          className="glass-input"
          style={{ width: '280px' }}
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="gradient-button" onClick={() => { setIsRegisterModalOpen(true); setErr(''); setMsg(''); }}>
          <UserPlus size={16} /> Register System User
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto', background: '#ffffff' }}>
        {loading ? (
          <p style={{ color: '#64748b', padding: '1rem' }}>Loading user directory...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.75rem 1rem' }}>User ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Full Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
                <th style={{ padding: '0.75rem 1rem' }}>System Role</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.userId} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontWeight: '600' }}>#{u.userId}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#0f172a', fontWeight: '700' }}>{u.fullName}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{u.email}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{getRoleBadge(u.role)}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleViewDetails(u.userId)}
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' }}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => setEditingUser(u)}
                        style={{ background: '#e0e7ff', border: '1px solid #c7d2fe', color: '#4338ca', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' }}
                        title="Edit User"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(u.userId)}
                        style={{ background: '#ffe4e6', border: '1px solid #fecdd3', color: '#be123c', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' }}
                        title="Remove User"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Register User Modal */}
      {isRegisterModalOpen && (
        <div className="modal-backdrop">
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '1.5rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} color="#4f46e5" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>Register System User</h3>
              </div>
              <button onClick={() => setIsRegisterModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {msg && (
              <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#047857', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={15} /> {msg}
              </div>
            )}

            {err && (
              <div style={{ background: '#ffe4e6', border: '1px solid #fecdd3', color: '#be123c', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {err}
              </div>
            )}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Full Name</label>
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%' }}
                  placeholder="e.g. Alex Mercer"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Email Address</label>
                <input
                  type="email"
                  className="glass-input"
                  style={{ width: '100%' }}
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Password</label>
                <input
                  type="password"
                  className="glass-input"
                  style={{ width: '100%' }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>System Role</label>
                <select
                  className="glass-input"
                  style={{ width: '100%', cursor: 'pointer' }}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsRegisterModalOpen(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" className="gradient-button">
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-backdrop">
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '1.5rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>Update User #{editingUser.userId}</h3>
              <button onClick={() => setEditingUser(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {msg && (
              <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#047857', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {msg}
              </div>
            )}

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Full Name</label>
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%' }}
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Email Address</label>
                <input
                  type="email"
                  className="glass-input"
                  style={{ width: '100%' }}
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>System Role</label>
                <select
                  className="glass-input"
                  style={{ width: '100%', cursor: 'pointer' }}
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingUser(null)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" className="gradient-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Details Modal */}
      {viewingUser && (
        <div className="modal-backdrop">
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '1.5rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>User Profile Details</h3>
              <button onClick={() => setViewingUser(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
              <div><strong style={{ color: '#0f172a' }}>User ID:</strong> #{viewingUser.userId}</div>
              <div><strong style={{ color: '#0f172a' }}>Full Name:</strong> {viewingUser.fullName}</div>
              <div><strong style={{ color: '#0f172a' }}>Email Address:</strong> {viewingUser.email}</div>
              <div><strong style={{ color: '#0f172a' }}>Assigned Role:</strong> {getRoleBadge(viewingUser.role)}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button onClick={() => setViewingUser(null)} className="gradient-button">
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};