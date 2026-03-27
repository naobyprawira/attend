const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5678";

// ── Status ──────────────────────────────────────────────────

export const fetchStatus = () => fetch(`${API}/api/status`).then((r) => r.json());

// ── Events ──────────────────────────────────────────────────

export const fetchEvents = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return fetch(`${API}/api/events${qs}`).then((r) => r.json());
};

export const fetchEventStats = () => fetch(`${API}/api/events/stats`).then((r) => r.json());

// ── Persons ─────────────────────────────────────────────────

export const fetchPersons = () => fetch(`${API}/api/persons`).then((r) => r.json());

export const fetchPerson = (id: number) => fetch(`${API}/api/persons/${id}`).then((r) => r.json());

export const registerPerson = (name: string, photo: File) => {
  const form = new FormData();
  form.append("name", name);
  form.append("photo", photo);
  return fetch(`${API}/api/persons`, { method: "POST", body: form }).then((r) => r.json());
};

export const deletePerson = (id: number) =>
  fetch(`${API}/api/persons/${id}`, { method: "DELETE" }).then((r) => r.json());

export const personPhotoUrl = (id: number) => `${API}/api/persons/${id}/photo`;

// ── Settings ────────────────────────────────────────────────

export const fetchSettings = () => fetch(`${API}/api/settings`).then((r) => r.json());

export const updateSettings = (data: Record<string, unknown>) =>
  fetch(`${API}/api/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

// ── WebSocket ───────────────────────────────────────────────

export const getWsUrl = (path: string) => API.replace(/^http/, "ws") + path;
