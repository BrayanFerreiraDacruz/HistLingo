const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getToken(): string | null {
  return localStorage.getItem('histlingo_token');
}

function setToken(token: string): void {
  localStorage.setItem('histlingo_token', token);
}

function clearToken(): void {
  localStorage.removeItem('histlingo_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Erro ${res.status}`);
  }

  return res.json();
}

export const auth = {
  register: async (username: string, email: string, password: string) => {
    const data = await request<{ access_token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    setToken(data.access_token);
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await request<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token);
    return data;
  },

  me: () => request<User>('/auth/me'),

  logout: () => {
    clearToken();
  },

  isLoggedIn: () => !!getToken(),
};

export const content = {
  getModules: () => request<Module[]>('/content/modules'),
  getLessons: (moduleId: string) => request<Lesson[]>(`/content/modules/${moduleId}/lessons`),
  getChallenges: (lessonId: string) => request<Challenge[]>(`/content/lessons/${lessonId}/challenges`),
};

export const users = {
  submitAnswer: (userId: string, challengeId: string, quality: number) =>
    request<{ xpGain: number; nextReviewDate: string }>(`/users/${userId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ challengeId, quality }),
    }),
  updateStreak: (userId: string) =>
    request(`/users/${userId}/streak/update`, { method: 'POST' }),
};

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  xpTotal: number;
  level: number;
  streakCount: number;
  lastActivityDate: string | null;
  createdAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  xpReward: number;
  order: number;
}

export interface Challenge {
  id: string;
  lessonId: string;
  type: 'WHO_AM_I' | 'WORKS_AND_RELICS' | 'TIMELINE' | 'DECISION_SCENARIO';
  content: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string | null;
  difficultyWeight: number;
}
