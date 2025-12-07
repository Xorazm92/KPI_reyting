import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginScreen.css';

export function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password) {
      setError('Login va parolni kiriting');
      return;
    }

    const result = login(username.trim(), password);
    if (!result.success) {
      setError(result.message);
      setPassword('');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">🛡️ Mehnat Muhofazasi Reyting Tizimi</h1>
          <p className="login-subtitle">Xavfsizlik tizimiga kirish</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-username">Login</label>
              <input
                type="text"
                id="login-username"
                placeholder="Loginni kiriting"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Parol</label>
              <input
                type="password"
                id="login-password"
                placeholder="Parolni kiriting"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn">Kirish</button>
          </form>

          <div className="login-info">
            <p><strong>Test hisoblari:</strong></p>
            <ul>
              <li>admin / admin123</li>
              <li>manager / manager123</li>
              <li>supervisor / super123</li>
              <li>user / user123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
