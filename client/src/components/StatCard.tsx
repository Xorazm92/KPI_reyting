import React from 'react';
import './StatCard.css';

interface StatCardProps {
  icon: string;
  value: number | string;
  label: string;
  variant?: 'default' | 'green' | 'yellow' | 'red';
}

export function StatCard({ icon, value, label, variant = 'default' }: StatCardProps) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
