import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <h1>🛡️ Mehnat Muhofazasi Reyting Tizimi</h1>
        <p className="subtitle">Korxonalar xavfsizlik samaradorligini baholash va taqqoslash platformasi</p>
      </div>
      <div className="user-info">
        <span className="current-user">👤 {user?.username}</span>
        <button className="logout-btn" onClick={logout}>Chiqish</button>
      </div>
    </header>
  );
}
