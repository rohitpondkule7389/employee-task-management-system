import React, { useState } from 'react';
import { User, Mail, Shield, Phone, Calendar, Edit2, Check, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../services/api';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'John Doe',
    email: user?.email || 'user@company.com',
    phone: user?.phone || '+1 (555) 234-5678',
  });
  const [msg, setMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (user?.userId) {
        await updateUser(user.userId, {
          fullName: formData.fullName,
          email: formData.email,
          role: user.role
        });
      }
      updateUserProfile({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      });
      setMsg('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '720px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
        {/* Profile Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: '#ffffff',
            fontSize: '2rem',
            fontWeight: '800',
            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)'
          }}>
            {formData.fullName.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{formData.fullName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className="badge badge-inprogress" style={{ textTransform: 'capitalize' }}>
                <Shield size={12} /> {user?.role || 'Employee'}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>User ID: #{user?.userId || 1}</span>
            </div>
          </div>
        </div>

        {msg && (
          <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#047857', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={16} /> {msg}
          </div>
        )}

        {/* Profile Details / Form */}
        {!isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <User size={18} color="#4f46e5" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Full Name</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{formData.fullName}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <Mail size={18} color="#0284c7" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Email Address</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{formData.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <Phone size={18} color="#059669" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Phone Number</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{formData.phone}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <Calendar size={18} color="#d97706" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Member Since</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>January 2026</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="gradient-button" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} /> Edit Profile Information
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Full Name</label>
              <input
                type="text"
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Email Address</label>
              <input
                type="email"
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Phone Number</label>
              <input
                type="text"
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" className="gradient-button">
                <Save size={16} /> Save Profile Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
