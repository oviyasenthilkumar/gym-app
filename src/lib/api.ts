// API Configuration and utilities

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  weight?: number;
  role?: 'admin' | 'trainer' | 'member';
  membershipStartDate?: string;
  membershipEndDate?: string;
  plan?: string;
  status?: string;
  isActive?: boolean;
  nextBillingDate?: string;
  class?: string;
  classType?: string;
  difficultyLevel?: string;
  daysUntilExpiration?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  _id: string;
  name: string;
  trainer: string;
  date: string;
  startTime: string;
  capacity: number;
  status: 'Scheduled' | 'Cancelled' | 'Completed';
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  activeMembersCount?: number;
  expiringMembersCount?: number;
  expiringMembersList?: Member[];
  weeklyClassesCount?: number;
  attendancePercentage?: number;
  completedSessionsAttendancePercentage?: number;
  totalMembers?: number;
  expiringMembers?: number;
  weeklyClasses?: number;
  totalAttendance?: number;
}

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
};

// Get user from localStorage
export const getUser = (): LoginResponse['user'] | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Set user in localStorage
export const setUser = (user: LoginResponse['user']): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
export const removeUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    membershipStartDate?: string,
    membershipEndDate?: string,
    plan?: string,
    className?: string,
    classType?: string,
    difficultyLevel?: string,
    role?: string,
    age?: number,
    weight?: number
  ): Promise<ApiResponse<LoginResponse>> => {
    return apiRequest<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        confirmPassword,
        membershipStartDate,
        membershipEndDate,
        plan,
        class: className,
        classType,
        difficultyLevel,
        role,
        age,
        weight
      }),
    });
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyOTP: async (email: string, otp: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  resetPassword: async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ApiResponse<void>> => {
    return apiRequest<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
    });
  },

  getProfile: async (): Promise<ApiResponse<LoginResponse['user'] & { memberDetails?: Member }>> => {
    return apiRequest<LoginResponse['user'] & { memberDetails?: Member }>('/auth/me');
  },
};

// Members API
export const membersApi = {
  getAll: async (search?: string, status?: string, role?: string): Promise<ApiResponse<Member[]>> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (role) params.append('role', role);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<Member[]>(`/members${query}`);
  },

  getById: async (id: string): Promise<ApiResponse<Member>> => {
    return apiRequest<Member>(`/members/${id}`);
  },

  getProfile: async (): Promise<ApiResponse<Member>> => {
    return apiRequest<Member>('/members/profile');
  },

  updateProfile: async (memberData: {
    name?: string;
    email?: string;
    phone?: string;
    age?: number;
    weight?: number;
  }): Promise<ApiResponse<Member>> => {
    return apiRequest<Member>('/members/profile', {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  },

  create: async (memberData: {
    name: string;
    email: string;
    phone: string;
    role?: 'admin' | 'trainer' | 'member';
    membershipStartDate?: string;
    membershipEndDate?: string;
    plan?: string;
    status?: string;
    nextBillingDate?: string;
    className?: string;
    classType?: string;
    difficultyLevel?: string;
    age?: number;
    weight?: number;
  }): Promise<ApiResponse<Member>> => {
    return apiRequest<Member>('/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  },

  update: async (id: string, memberData: Partial<Member>): Promise<ApiResponse<Member>> => {
    return apiRequest<Member>(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/members/${id}`, {
      method: 'DELETE',
    });
  },
};

// Sessions API
export const sessionsApi = {
  getAll: async (startDate?: string, endDate?: string, status?: string): Promise<ApiResponse<Session[]>> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<Session[]>(`/sessions${query}`);
  },

  getById: async (id: string): Promise<ApiResponse<Session>> => {
    return apiRequest<Session>(`/sessions/${id}`);
  },

  create: async (sessionData: {
    name: string;
    trainer: string;
    date: string;
    startTime: string;
    capacity: number;
    location?: string;
  }): Promise<ApiResponse<Session>> => {
    return apiRequest<Session>('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  update: async (id: string, sessionData: Partial<Session>): Promise<ApiResponse<Session>> => {
    return apiRequest<Session>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  },

  cancel: async (id: string): Promise<ApiResponse<Session>> => {
    return apiRequest<Session>(`/sessions/${id}/cancel`, {
      method: 'PUT',
    });
  },
};

// Dashboard API
export const dashboardApi = {
  getAdminStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiRequest<DashboardStats>('/dashboard/admin');
  },

  getTrainerStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiRequest<DashboardStats>('/dashboard/trainer');
  },

  getMemberStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiRequest<DashboardStats>('/dashboard/member');
  },
};

// Attendance API
export const attendanceApi = {
  mark: async (sessionId: string, memberIds: string[]): Promise<ApiResponse<{ marked: number; errors: any[] }>> => {
    return apiRequest<{ marked: number; errors: any[] }>('/attendance', {
      method: 'POST',
      body: JSON.stringify({ sessionId, memberIds }),
    });
  },

  getBySession: async (sessionId: string): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>(`/attendance/session/${sessionId}`);
  },
};

