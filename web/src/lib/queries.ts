import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStatus,
  fetchEvents,
  fetchEventStats,
  fetchPersons,
  registerPerson,
  deletePerson,
} from "@/lib/api";

// ── Keys ────────────────────────────────────────────────────

export const keys = {
  status: ["status"] as const,
  events: (params?: Record<string, string>) => ["events", params] as const,
  eventStats: ["eventStats"] as const,
  persons: ["persons"] as const,
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
