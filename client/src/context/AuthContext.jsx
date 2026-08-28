import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

function storeSession({ user, accessToken, refreshToken }) {
  localStorage.setItem('kaalmo_access_token', accessToken);
  localStorage.setItem('kaalmo_refresh_token', refreshToken);
  localStorage.setItem('kaalmo_user', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem('kaalmo_access_token');
  localStorage.removeItem('kaalmo_refresh_token');
  localStorage.removeItem('kaalmo_user');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('kaalmo_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) localStorage.setItem('kaalmo_user', JSON.stringify(user));
  }, [user]);

  // The API client dispatches this when a 401 survives a refresh-token
  // retry — the session is genuinely gone server-side, so the UI should
  // reflect that immediately instead of showing a logged-in navbar for a
  // dead session.
  useEffect(() => {
    function handleExpired() {
      setUser(null);
    }
    window.addEventListener('kaalmo:session-expired', handleExpired);
    return () => window.removeEventListener('kaalmo:session-expired', handleExpired);
  }, []);

  async function login({ email, password }) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      storeSession(data);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Login failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', payload);
      storeSession(data);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  // Sends a confirmation email — does NOT grant the organizer role itself.
  // The role is only added when the user clicks the link in that email
  // (see confirmOrganizerAccess / OrganizerConfirm.jsx).
  async function requestOrganizerAccess({ fullName, purpose } = {}) {
    const { data } = await api.post('/users/me/request-organizer-access', { fullName, purpose });
    return data;
  }

  // Re-fetches the current user's profile and updates local state/storage.
  // Needed after actions that change the account server-side but don't
  // return a fresh user object themselves — e.g. clicking an email
  // verification link opens a public, unauthenticated endpoint, so the
  // logged-in session's cached `user.emailVerified` would otherwise stay
  // stale until the next login.
  async function refreshUser() {
    if (!localStorage.getItem('kaalmo_access_token')) return null;
    const { data } = await api.get('/users/me');
    setUser(data);
    localStorage.setItem('kaalmo_user', JSON.stringify(data));
    return data;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, requestOrganizerAccess, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
