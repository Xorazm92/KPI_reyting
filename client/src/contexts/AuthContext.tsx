import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

const USERS: Record<string, string> = {
  'admin': 'admin123',
  'manager': 'manager123',
  'supervisor': 'super123',
  'user': 'user123'
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('loggedInUser');
    if (sessionUser) {
      try {
        setUser(JSON.parse(sessionUser));
      } catch {
        sessionStorage.removeItem('loggedInUser');
      }
    }
  }, []);

  const login = (username: string, password: string) => {
    if (USERS[username] && USERS[username] === password) {
      const newUser: User = { 
        username, 
        role: username === 'admin' ? 'admin' : 
              username === 'manager' ? 'manager' :
              username === 'supervisor' ? 'supervisor' : 'user'
      };
      setUser(newUser);
      sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));
      return { success: true, message: 'Muvaffaqiyatli kirdi' };
    }
    return { success: false, message: "Noto'g'ri login yoki parol" };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('loggedInUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: user !== null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
