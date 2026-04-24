const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";
const REPORTS_MS_URL = process.env.NEXT_PUBLIC_REPORTS_URL ?? "http://localhost:8082";
const PLAYER_MANAGEMENT_MS_URL = process.env.NEXT_PUBLIC_PLAYER_MANAGEMENT_MS_URL ?? "http://localhost:8081";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  name?: string;
  surname?: string;
  birthday?: string;
  mobilePhone?: string;
  sex?: string;
}

export interface PlayerProfile {
  id: number;
  username: string;
  email: string;
  name: string | null;
  surname: string | null;
}

export interface PlayerProfileResponse {
  id: number;
  username: string | null;
  email: string | null;
  name: string | null;
  surname: string | null;
  birthday: string | null;
  mobilePhone: string | null;
  sex: string | null;
  createdAt: string | null;
  role: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  name?: string;
  surname?: string;
  birthday?: string;
  mobilePhone?: string;
  sex?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  player: PlayerProfile;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export async function getProfile(token: string): Promise<PlayerProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/players/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export async function updateProfile(token: string, data: UpdateProfileData): Promise<PlayerProfileResponse> {
  const body: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value) body[key] = value;
  }
  const res = await fetch(`${API_BASE_URL}/api/v1/players/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export interface AdminUser {
  id: string;
  username: string;
  email: string | null;
  name: string | null;
  surname: string | null;
  role: string;
  sex: string;
  status: string;
  createdAt: string | null;
}

export interface AdminUpdateBody {
  username: string;
  email: string;
  name: string;
  surname: string;
  sex: string;
  role: string;
}

export interface RegistrationTrendPoint {
  date: string;
  count: number;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  genderBreakdown: {
    male: number;
    female: number;
    other: number;
    preferNotToSay: number;
  };
}

export async function getAdminUsers(token: string): Promise<AdminUsersResponse> {
  const res = await fetch(`${REPORTS_MS_URL}/api/reports/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export async function getRegistrationTrend(token: string): Promise<RegistrationTrendPoint[]> {
  const res = await fetch(`${REPORTS_MS_URL}/api/reports/admin/registrations/trend`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export async function suspendPlayer(id: string, token: string): Promise<void> {
  const res = await fetch(`${PLAYER_MANAGEMENT_MS_URL}/api/v1/admin/players/${id}/suspend`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.message);
  }
}

export async function activatePlayer(id: string, token: string): Promise<void> {
  const res = await fetch(`${PLAYER_MANAGEMENT_MS_URL}/api/v1/admin/players/${id}/activate`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.message);
  }
}

export async function deletePlayer(id: string, token: string): Promise<void> {
  const res = await fetch(`${PLAYER_MANAGEMENT_MS_URL}/api/v1/admin/players/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.message);
  }
}

export async function updatePlayer(id: string, body: AdminUpdateBody, token: string): Promise<AdminUser> {
  const res = await fetch(`${PLAYER_MANAGEMENT_MS_URL}/api/v1/admin/players/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export async function registerUser(credentials: RegisterCredentials): Promise<AuthResponse> {
  const { username, email, password, isAdmin, name, surname, birthday, mobilePhone, sex } = credentials;
  const body: Record<string, string | boolean> = { username, email, password };
  if (isAdmin) body.isAdmin = true;
  if (name) body.name = name;
  if (surname) body.surname = surname;
  if (birthday) body.birthday = birthday;
  if (mobilePhone) body.mobilePhone = mobilePhone;
  if (sex) body.sex = sex;
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}
