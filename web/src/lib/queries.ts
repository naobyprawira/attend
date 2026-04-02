import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStatus,
  fetchEvents,
  fetchEventStats,
  fetchPersons,
  registerPerson,
  deletePerson,
  fetchSettings,
  updateSettings,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/api";
import type { DetectionEvent, EventStats, Person, ServerStatus, Settings, User } from "@/lib/types";

const FAST_POLL_INTERVAL_MS = 5_000;

// ── Keys ────────────────────────────────────────────────────

export const keys = {
  status: ["status"] as const,
  events: (params?: Record<string, string>) => ["events", params] as const,
  eventStats: ["eventStats"] as const,
  persons: ["persons"] as const,
  settings: ["settings"] as const,
  users: ["users"] as const,
};

// ── Status ──────────────────────────────────────────────────

export function useStatus() {
  return useQuery<ServerStatus>({
    queryKey: keys.status,
    queryFn: fetchStatus,
    refetchInterval: FAST_POLL_INTERVAL_MS,
  });
}

// ── Events ──────────────────────────────────────────────────

export function useEvents(params?: Record<string, string>) {
  return useQuery<DetectionEvent[]>({
    queryKey: keys.events(params),
    queryFn: () => fetchEvents(params),
    refetchInterval: FAST_POLL_INTERVAL_MS,
  });
}

export function useEventStats() {
  return useQuery<EventStats>({
    queryKey: keys.eventStats,
    queryFn: fetchEventStats,
    refetchInterval: FAST_POLL_INTERVAL_MS,
  });
}

// ── Persons ─────────────────────────────────────────────────

export function usePersons() {
  return useQuery<Person[]>({
    queryKey: keys.persons,
    queryFn: fetchPersons,
    refetchInterval: FAST_POLL_INTERVAL_MS,
  });
}

export function useRegisterPerson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, photo }: { name: string; photo: File }) =>
      registerPerson(name, photo),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.persons }),
  });
}

export function useDeletePerson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePerson(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.persons }),
  });
}

// ── Settings ────────────────────────────────────────────────

export function useSettings() {
  return useQuery<Settings>({
    queryKey: keys.settings,
    queryFn: fetchSettings,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => updateSettings(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.settings }),
  });
}

// ── Users ────────────────────────────────────────────────────

export function useUsers(opts?: { enabled?: boolean }) {
  return useQuery<User[]>({
    queryKey: keys.users,
    queryFn: fetchUsers,
    enabled: opts?.enabled ?? true,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { username: string; email: string; password: string; role: string }) =>
      createUser(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.users }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; role?: string; status?: string }) =>
      updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.users }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.users }),
  });
}
