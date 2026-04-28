export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://185.200.244.215:9400/api";

export interface Profile {
  id: string;
  name: string;
  gender: string | null;
  gender_probability: number | null;
  age: number | null;
  age_group: string | null;
  country_id: string | null;
  country_name: string | null;
  country_probability: number | null;
  created_at: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalMale: number;
  totalFemale: number;
  recentProfiles: number;
}

export interface PaginatedResponse<T> {
  status: string;
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  links: {
    self: string;
    next: string | null;
    prev: string | null;
  };
  data: T[];
}

export interface User {
  id: string;
  githubId: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
}

// Get CSRF token from cookie
function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const name = "csrf_token=";
  const decoded = decodeURIComponent(document.cookie);
  const ca = decoded.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

import { apiFetch } from "./api-client";

export async function loginWithGitHub(): Promise<void> {
  window.location.href = `${API_BASE}/auth/github`;
}

export async function logout(): Promise<{ status: string; message: string }> {
  const response = await apiFetch(`/auth/logout`, {
    method: "POST",
  });
  window.location.href = "/login";

  return response.json();
}

export async function getCurrentUser(): Promise<User | null> {
  const response = await apiFetch(`/auth/me`, {});
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.data;
}

export async function getProfiles(
  params: Record<string, string | number> = {},
): Promise<PaginatedResponse<Profile>> {
  const queryParams = new URLSearchParams();

  console.log("this here");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  const response = await apiFetch(`/profiles?${queryParams}`, {
    headers: {
      "X-API-Version": "1",
    },
  });

  if (!response.ok) {
    throw Error(await response.text());
  }

  return response.json();
}

export async function getProfile(id: string): Promise<Profile> {
  const response = await apiFetch(`/profiles/${id}`, {
    headers: {
      "X-API-Version": "1",
    },
  });

  if (!response.ok) {
    throw Error(await response.text());
  }

  const data = await response.json();
  return data.data;
}
export async function getDashboard(): Promise<DashboardStats> {
  const response = await apiFetch(`/dashboard/stats`, {
    headers: {
      "X-API-Version": "1",
    },
  });

  if (!response.ok) {
    throw Error(await response.text());
  }

  const data = await response.json();
  return data.data;
}

export async function searchProfiles(
  query: string,
  url: string,
): Promise<PaginatedResponse<Profile>> {
  let urlAndQuery = `/profiles/search?q=${encodeURIComponent(query)}`;
  if (url) {
    urlAndQuery = url.replace("/api", "");
  }

  if (query) {
    urlAndQuery = `/profiles/search?q=${encodeURIComponent(query)}`;
  }
  const response = await apiFetch(urlAndQuery, {
    headers: {
      "X-API-Version": "1",
    },
  });

  if (!response.ok) {
    throw Error(await response.text());
  }

  return response.json();
}

export async function createProfile(name: string): Promise<Profile> {
  const response = await apiFetch(`/profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Version": "1",
      "X-CSRF-Token": getCsrfToken() || "",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw Error(await response.text());
  }

  const data = await response.json();
  return data.data;
}

export async function exportProfiles(
  params: Record<string, string | number> = {},
): Promise<Blob> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });
  queryParams.append("format", "csv");

  const response = await apiFetch(`/profiles/export?${queryParams}`, {
    headers: {
      "X-API-Version": "1",
      "X-CSRF-Token": getCsrfToken() || "",
    },
  });

  if (!response.ok) {
    throw Error(await response.text());
  }

  return response.blob();
}

export async function refreshToken(): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Session ended, please login to gain access");
  }
}
