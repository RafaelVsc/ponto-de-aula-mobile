import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { api, setAuthToken, setUnauthorizedHandler } from '../api/client';
import { clearSession, loadSession, saveSession, type StoredSession } from './storage';
import type { Role } from './roles';

export type AuthUser = {
  id: string;
  name: string;
  role: Role;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  setSession: (session: StoredSession) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    setToken(null);
    await clearSession();
  }, []);

  const setSession = useCallback(async (session: StoredSession) => {
    if (!session?.token || !session?.user) {
      throw new Error('Sessão inválida');
    }
    const token = `${session.token}`;
    setAuthToken(token);
    setUser(session.user);
    setToken(token);
    await saveSession({ token, user: session.user });
  }, []);

  useEffect(() => {
    let mounted = true;
    loadSession()
      .then((session) => {
        if (!mounted || !session) return;
        setAuthToken(session.token);
        setUser(session.user);
        setToken(session.token);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
    });
    return () => {
      setUnauthorizedHandler(null);
    };
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      setSession,
      logout,
      isAuthenticated: Boolean(user && token),
    }),
    [loading, logout, setSession, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export { api };
