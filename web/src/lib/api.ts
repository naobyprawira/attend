import type { EventStats, Person, ServerStatus, Settings, User } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5678";

interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
  expiresIn: number;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: AuthUser;
}

interface RefreshResponse {
  access_token: string;
  expires_in: number;
  user: AuthUser;
}

interface QueryEventsResponse {
  items: DetectionEvent[];
  next_cursor: string | null;
  has_more: boolean;
}

interface ApiErrorShape {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  detail?: {
    code?: string;
    message?: string;
  } | string;
}

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(message: string, status: number, code: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface DetectionEvent {
  id: number;
  timestamp: string;
  event_type: string;
  person_name: string | null;
  confidence: number | null;
  bbox: string | null;
  thumbnail: string | null;
  frame_number: number | null;
}

let accessToken: string | null = null;
let refreshPromise: Promise<AuthSession | null> | null = null;
let authSessionListener: ((session: AuthSession | null) => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function setAuthSessionListener(listener: ((session: AuthSession | null) => void) | null) {
  authSessionListener = listener;
}

function publishSession(session: AuthSession | null) {
  setAccessToken(session?.accessToken ?? null);
  authSessionListener?.(session);
}

function toApiError(status: number, body: ApiErrorShape | null): ApiError {
  const codeFromStatus =
    status === 401
      ? "UNAUTHENTICATED"
      : status === 403
      ? "FORBIDDEN"
      : status === 404
      ? "NOT_FOUND"
      : status === 409
      ? "CONFLICT"
      : status === 422
      ? "VALIDATION_ERROR"
      : "REQUEST_FAILED";

  const code = body?.error?.code ??
    (typeof body?.detail === "object" && body?.detail !== null ? body.detail.code : undefined) ??
    codeFromStatus;
  const message = body?.error?.message ??
    (typeof body?.detail === "object" && body?.detail !== null ? body.detail.message : undefined) ??
    (typeof body?.detail === "string" ? body.detail : undefined) ??
    `Request failed (${status})`;

  return new ApiError(message, status, code, body?.error?.details);
}

async function parseError(response: Response): Promise<ApiError> {
  const body = (await response.json().catch(() => null)) as ApiErrorShape | null;
  return toApiError(response.status, body);
}

function makeAuthHeaders(headers?: HeadersInit): Headers {
  const merged = new Headers(headers ?? {});
  if (accessToken && !merged.has("Authorization")) {
    merged.set("Authorization", `Bearer ${accessToken}`);
  }
  return merged;
}

function parseAuthSession(payload: RefreshResponse): AuthSession {
  if (!payload?.access_token || !payload?.user) {
    throw new ApiError("Invalid auth session response", 500, "INVALID_SESSION_PAYLOAD");
  }
  return {
    accessToken: payload.access_token,
    user: payload.user,
    expiresIn: payload.expires_in,
  };
}

async function clearRefreshCookie() {
  await fetch(`${API}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => undefined);
}

export async function refreshSession(): Promise<AuthSession | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        publishSession(null);
        await clearRefreshCookie();
        return null;
      }

      const payload = (await response.json()) as RefreshResponse;
      const session = parseAuthSession(payload);
      publishSession(session);
      return session;
    } catch {
      publishSession(null);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function requestRaw(
  url: string,
  init: RequestInit = {},
  opts: { retryOnUnauthorized?: boolean } = { retryOnUnauthorized: true },
): Promise<Response> {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: makeAuthHeaders(init.headers),
  });

  if (response.status !== 401 || !opts.retryOnUnauthorized) {
    return response;
  }

  const session = await refreshSession();
  if (!session) {
    return response;
  }

  return fetch(url, {
    ...init,
    credentials: "include",
    headers: makeAuthHeaders(init.headers),
  });
}

async function requestJson<T>(
  url: string,
  init: RequestInit = {},
  opts: { retryOnUnauthorized?: boolean } = { retryOnUnauthorized: true },
): Promise<T> {
  const response = await requestRaw(url, init, opts);
  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

// ── Auth (used by AuthContext) ──────────────────────────────

export async function loginWithPassword(username: string, password: string): Promise<AuthSession> {
  const payload = await requestJson<AuthResponse>(
    `${API}/api/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    },
    { retryOnUnauthorized: false },
  );

  const session: AuthSession = {
    accessToken: payload.access_token,
    user: payload.user,
    expiresIn: payload.expires_in,
  };
  publishSession(session);
  return session;
}

export async function logoutSession(): Promise<void> {
  await fetch(`${API}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => undefined);
  publishSession(null);
}

// ── Status ──────────────────────────────────────────────────

export const fetchStatus = () => requestJson<ServerStatus>(`${API}/api/status`);

// ── Events ──────────────────────────────────────────────────

export const fetchEvents = async (params?: Record<string, string>) => {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
  const data = await requestJson<QueryEventsResponse | DetectionEvent[]>(`${API}/api/events${qs}`);
  return Array.isArray(data) ? data : data.items;
};

export const fetchEventStats = () => requestJson<EventStats>(`${API}/api/events/stats`);

// ── Persons ─────────────────────────────────────────────────

export const fetchPersons = () => requestJson<Person[]>(`${API}/api/persons`);

export const fetchPerson = (id: number) => requestJson<Person>(`${API}/api/persons/${id}`);

export const registerPerson = (name: string, photo: File) => {
  const form = new FormData();
  form.append("name", name);
  form.append("photo", photo);
  return requestJson<Person>(`${API}/api/persons`, {
    method: "POST",
    body: form,
  });
};

export const deletePerson = (id: number) =>
  requestJson<void>(`${API}/api/persons/${id}`, { method: "DELETE" });

export const personPhotoUrl = (id: number) => `${API}/api/persons/${id}/photo`;

// ── Settings ────────────────────────────────────────────────

export const fetchSettings = () => requestJson<Settings>(`${API}/api/settings`);

export const updateSettings = (data: Record<string, unknown>) =>
  requestJson<{ status: string }>(`${API}/api/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// ── Users (admin) ───────────────────────────────────────────

export const fetchUsers = () => requestJson<User[]>(`${API}/api/users`);

export const createUser = (data: { username: string; email: string; password: string; role: string }) =>
  requestJson<User>(`${API}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateUser = (id: number, data: { role?: string; status?: string }) =>
  requestJson<User>(`${API}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteUser = (id: number) =>
  requestJson<void>(`${API}/api/users/${id}`, { method: "DELETE" });

// ── Auth: Request Access (public) ───────────────────────────

export const requestAccess = (data: { username: string; email: string; password: string }) =>
  requestJson<{ message: string }>(
    `${API}/api/auth/request-access`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    { retryOnUnauthorized: false },
  );

// ── WebSocket ───────────────────────────────────────────────

export const getWsUrl = (path: string) => API.replace(/^http/, "ws") + path;
