'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('booknook_user');
      const storedToken = localStorage.getItem('booknook_token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to fetch JWT token from server
  const fetchJwtToken = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/jwt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name || userData.displayName,
          image: userData.photoURL || userData.image
        })
      });
      const data = await res.json();
      if (data.token) {
        return data.token;
      }
    } catch (err) {
      console.error('Failed to get JWT from server:', err);
    }
    // Fallback client token if server is connecting
    return `jwt_${btoa(userData.email)}_${Date.now()}`;
  };

  // Register user with credentials
  const registerWithEmail = async (name, email, photoURL, password) => {
    // Password validation: 1 uppercase, 1 lowercase, at least 6 chars
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const isLongEnough = password.length >= 6;

    if (!hasUpper || !hasLower || !isLongEnough) {
      let errors = [];
      if (!isLongEnough) errors.push('at least 6 characters');
      if (!hasUpper) errors.push('an uppercase letter');
      if (!hasLower) errors.push('a lowercase letter');
      const errorMsg = `Password must have ${errors.join(', ')}.`;
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Save user in local registered accounts store for simulation
    const accounts = JSON.parse(localStorage.getItem('booknook_registered_users') || '[]');
    const existing = accounts.find((acc) => acc.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      const msg = 'An account with this email already exists. Please log in.';
      toast.error(msg);
      throw new Error(msg);
    }

    const newUser = {
      name,
      email,
      photoURL: photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      password,
      createdAt: new Date().toISOString()
    };

    accounts.push(newUser);
    localStorage.setItem('booknook_registered_users', JSON.stringify(accounts));
    toast.success('Registration successful! Please login with your credentials.');
    return newUser;
  };

  // Login user with credentials
  const loginWithEmail = async (email, password) => {
    const accounts = JSON.parse(localStorage.getItem('booknook_registered_users') || '[]');
    const matched = accounts.find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );

    // If matches custom registered account or demo admin account
    let authenticatedUser = null;
    if (matched) {
      authenticatedUser = {
        name: matched.name,
        email: matched.email,
        photoURL: matched.photoURL
      };
    } else if (email === 'admin@booknook.com' && password === 'Admin123') {
      authenticatedUser = {
        name: 'Library Admin',
        email: 'admin@booknook.com',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      };
    } else {
      const msg = 'Invalid email or password. Please verify your credentials.';
      toast.error(msg);
      throw new Error(msg);
    }

    const jwtToken = await fetchJwtToken(authenticatedUser);

    setUser(authenticatedUser);
    setToken(jwtToken);
    localStorage.setItem('booknook_user', JSON.stringify(authenticatedUser));
    localStorage.setItem('booknook_token', jwtToken);
    toast.success(`Welcome back, ${authenticatedUser.name}!`);
    return authenticatedUser;
  };

  // Google Social Login
  const loginWithGoogle = async () => {
    try {
      // Simulates Google OAuth flow with high fidelity
      const googleUser = {
        name: 'Alex Reader',
        email: 'alex.reader@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
      };

      const jwtToken = await fetchJwtToken(googleUser);

      setUser(googleUser);
      setToken(jwtToken);
      localStorage.setItem('booknook_user', JSON.stringify(googleUser));
      localStorage.setItem('booknook_token', jwtToken);
      toast.success(`Signed in with Google as ${googleUser.name}!`);
      return googleUser;
    } catch (err) {
      toast.error('Google Sign-In failed. Please try again.');
      throw err;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('booknook_user');
    localStorage.removeItem('booknook_token');
    toast.success('Logged out successfully.');
  };

  // Authenticated fetch wrapper
  const authFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        registerWithEmail,
        loginWithEmail,
        loginWithGoogle,
        logout,
        authFetch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
