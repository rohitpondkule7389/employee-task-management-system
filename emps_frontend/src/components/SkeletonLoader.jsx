import React from 'react';

export const SkeletonCard = () => (
  <div className="glass-panel" style={{ padding: '1.25rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
    <div style={{ width: '40%', height: '14px', background: '#e2e8f0', borderRadius: '6px', animation: 'pulse 1.5s infinite' }}></div>
    <div style={{ width: '80%', height: '22px', background: '#cbd5e1', borderRadius: '6px', animation: 'pulse 1.5s infinite' }}></div>
    <div style={{ width: '100%', height: '40px', background: '#f1f5f9', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
      <div style={{ width: '30%', height: '14px', background: '#e2e8f0', borderRadius: '4px' }}></div>
      <div style={{ width: '25%', height: '14px', background: '#e2e8f0', borderRadius: '4px' }}></div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 4 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{ width: '100%', height: '45px', background: '#f1f5f9', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
    ))}
  </div>
);
