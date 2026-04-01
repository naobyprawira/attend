const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5678";

let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

function authHeaders(): HeadersInit {
  return _accessToken ? { Authorization: `Bearer ${_accessToken}` } : {};
}

function apiFetch(url: string, init: RequestInit = {}) {
  return fetch(url, {
    ...init,
    credentials: "include",
    headers: { ...authHeaders(), ...(init.headers ?? {}) },
  });
}

// ── Status ──────────────────────────────────────────────────

export const fetchStatus = () => apiFetch(`${API}/api/status`).then((r) => r.json());

// ── Events ──────────────────────────────────────────────────

export const fetchEvents = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return apiFetch(`${API}/api/events${qs}`)
    .then((r) => r.json())
    .then((data) => data.items ?? data);
};

export const fetchEventStats = () => apiFetch(`${API}/api/events/stats`).then((r) => r.json());

// ── Persons ─────────────────────────────────────────────────

export const fetchPersons = () => apiFetch(`${API}/api/persons`).then((r) => r.json());

export const fetchPerson = (id: number) => apiFetch(`${API}/api/persons/${id}`).then((r) => r.json());

export const registerPerson = (name: string, photo: File) => {
  const form = new FormData();
  form.append("name", name);
  form.append("photo", photo);
  return apiFetch(`${API}/api/persons`, { method: "POST", body: form }).then((r) => r.json());
};

export const deletePerson = (id: number) =>
  apiFetch(`${API}/api/persons/${id}`, { method: "DELETE" }).then((r) => r.json());

export const personPhotoUrl = (id: number) => `${API}/api/persons/${id}/photo`;

// ── Settings ────────────────────────────────────────────────

export const fetchSettings = () => apiFetch(`${API}/api/settings`).then((r) => r.json());

export const updateSettings = (data: Record<string, unknown>) =>
  apiFetch(`${API}/api/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

// ── WebSocket ───────────────────────────────────────────────

export const getWsUrl = (path: string) => API.replace(/^http/, "ws") + path;
