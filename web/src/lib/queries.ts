import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStatus,
  fetchEvents,
  fetchEventStats,
  fetchPersons,
  registerPerson,
  deletePerson,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/api";
import type { User } from "@/lib/types";

// ── Keys ────────────────────────────────────────────────────

export const keys = {
  status: ["status"] as const,
  events: (params?: Record<string, string>) => ["events", params] as const,
  eventStats: ["eventStats"] as const,
  persons: ["persons"] as const,
  users: ["users"] as const,
};

// ── Status ──────────────────────────────────────────────────

export function useStatus() {
  return useQuery({
    queryKey: keys.status,
    queryFn: fetchStatus,
    refetchInterval: 5_000,
  });
}

// ── Events ──────────────────────────────────────────────────

export function useEvents(params?: Record<string, string>) {
  return useQuery({
    queryKey: keys.events(params),
    queryFn: () => fetchEvents(params),
    refetchInterval: 5_000,
  });
}

export function useEventStats() {
  return useQuery({
    queryKey: keys.eventStats,
    queryFn: fetchEventStats,
    refetchInterval: 5_000,
  });
}

// ── Persons ─────────────────────────────────────────────────

export function usePersons() {
  return useQuery({
    queryKey: keys.persons,
    queryFn: fetchPersons,
    refetchInterval: 5_000,
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
