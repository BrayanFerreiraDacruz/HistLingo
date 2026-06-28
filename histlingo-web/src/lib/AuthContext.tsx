import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, User } from './api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.isLoggedIn()) {
      setIsLoading(false);
      return;
    }
    auth.me()
      .then(setUser)
      .catch((err: any) => {
        // Only clear token if explicitly unauthorized — not on server errors (503, network down)
        if (err?.status === 401) auth.logout();
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    await auth.login(email, password);
    const me = await auth.me();
    setUser(me);
  };

  const register = async (username: string, email: string, password: string) => {
    await auth.register(username, email, password);
    const me = await auth.me();
    setUser(me);
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    if (!auth.isLoggedIn()) return;
    try {
      const me = await auth.me();
      setUser(me);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
