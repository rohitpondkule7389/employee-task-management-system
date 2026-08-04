import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const getStyle = () => {
    switch (type) {
      case 'success':
        return { bg: '#d1fae5', border: '#a7f3d0', color: '#047857', icon: <CheckCircle2 size={18} color="#047857" /> };
      case 'error':
        return { bg: '#ffe4e6', border: '#fecdd3', color: '#be123c', icon: <AlertCircle size={18} color="#be123c" /> };
      default:
        return { bg: '#e0e7ff', border: '#c7d2fe', color: '#4338ca', icon: <Info size={18} color="#4338ca" /> };
    }
  };

  const style = getStyle();

  return (
    <div 
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
        padding: '0.85rem 1.25rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        maxWidth: '400px'
      }}
    >
      {style.icon}
      <span style={{ fontSize: '0.88rem', fontWeight: '600', flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: style.color, cursor: 'pointer' }}>
        <X size={16} />
      </button>
    </div>
  );
};
