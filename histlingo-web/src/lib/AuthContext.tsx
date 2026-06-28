import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { auth, User } from './api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  serverDown: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverDown, setServerDown] = useState(false);

  const tryLoadUser = useCallback(async () => {
    if (!auth.isLoggedIn()) {
      setIsLoading(false);
      return;
    }
    try {
      const me = await auth.me();
      setUser(me);
      setServerDown(false);
    } catch (err: any) {
      if (err?.status === 401) {
        auth.logout();
        setUser(null);
        setServerDown(false);
      } else {
        // Server error (503, network) — keep token, show reconnecting UI
        setServerDown(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    tryLoadUser();
  }, [tryLoadUser]);

  // When server is down and we have a token, retry every 8 seconds
  useEffect(() => {
    if (!serverDown || !auth.isLoggedIn()) return;
    const id = setInterval(() => {
      auth.me()
        .then(me => { setUser(me); setServerDown(false); })
        .catch(() => {});
    }, 8000);
    return () => clearInterval(id);
  }, [serverDown]);

  const login = async (email: string, password: string) => {
    await auth.login(email, password);
    const me = await auth.me();
    setUser(me);
    setServerDown(false);
  };

  const register = async (username: string, email: string, password: string) => {
    await auth.register(username, email, password);
    const me = await auth.me();
    setUser(me);
    setServerDown(false);
  };

  const logout = () => {
    auth.logout();
    setUser(null);
    setServerDown(false);
  };

  const refreshUser = async () => {
    if (!auth.isLoggedIn()) return;
    try {
      const me = await auth.me();
      setUser(me);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, serverDown, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
