import React from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

interface NavItem {
  path: string;
  icon: string;
  label: string;
  permission?: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', icon: '📊', label: 'Reyting Jadvali' },
  { path: '/risks', icon: '🎯', label: 'Xavflilik' },
  { path: '/add-company', icon: '➕', label: "Korxona Qo'shish", permission: 'admin' },
  { path: '/comparison', icon: '⚖️', label: 'Taqqoslash' },
  { path: '/statistics', icon: '📈', label: 'Statistika' }
];

export function Navigation() {
  const [location] = useLocation();
  const { user } = useAuth();

  const canAccess = (permission?: string) => {
    if (!permission) return true;
    if (user?.role === 'admin') return true;
    if (permission === 'admin' && user?.role === 'manager') return true;
    return false;
  };

  return (
    <nav className="nav-tabs">
      {NAV_ITEMS.filter(item => canAccess(item.permission)).map(item => (
        <Link key={item.path} href={item.path}>
          <button className={`tab-btn ${location === item.path ? 'active' : ''}`}>
            <span className="tab-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        </Link>
      ))}
    </nav>
  );
}
