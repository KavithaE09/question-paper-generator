import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ FIX: Ensure API URL includes /api prefix
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const API = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

  // ✅ Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        console.log('✅ User loaded from localStorage:', parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔍 Login attempt with:', { email, password });
      console.log('🔍 Login URL:', `${API}/auth/login`);
      
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('🔍 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('✅ Login successful:', data.user);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Login failed:', errorData);
      }
      return false;
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const signup = async (name, email, password, role = 'faculty') => {
    try {
      const response = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('✅ Signup successful:', data.user);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Signup failed:', errorData);
      }
      return false;
    } catch (error) {
      console.error('❌ Signup error:', error);
      return false;
    }
  };

  // ✅ NEW: Google login - saves user into AuthContext state
  const googleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('✅ Google login saved to AuthContext:', userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, googleLogin, logout }}>
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