import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        padding: '8px 14px',
        borderRadius: '8px',
        color: '#0f172a',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: data.payload.color }}></span>
          <span style={{ fontWeight: '600' }}>{data.name}:</span>
          <span style={{ color: '#4f46e5', fontWeight: '700' }}>{data.value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const DonutChartCard = ({ title, subtitle, data, centerLabel, centerValue, colors }) => {
  const total = data ? data.reduce((acc, curr) => acc + curr.value, 0) : 0;
  const displayValue = centerValue !== undefined ? centerValue : total;

  return (
    <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{subtitle}</p>}
      </div>

      <div style={{ position: 'relative', width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={86}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || colors[index % colors.length]} 
                  style={{ outline: 'none', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.06))' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label inside Donut */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', lineHeight: '1' }}>
            {displayValue}
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
            {centerLabel || 'Total'}
          </div>
        </div>
      </div>

      {/* Legend List */}
      <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#475569' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: item.color || colors[idx % colors.length]
            }}></span>
            <span>{item.name}:</span>
            <strong style={{ color: '#0f172a' }}>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
