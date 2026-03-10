import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Car } from "@/data/cars";

// ── API helpers ────────────────────────────────────────────────────────────

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Queries ────────────────────────────────────────────────────────────────

const CARS_KEY = ["cars"] as const;

export function useCars() {
  return useQuery({
    queryKey: CARS_KEY,
    queryFn: () => apiFetch<Car[]>("/api/cars"),
  });
}

export function useCar(id: string | undefined) {
  return useQuery({
    queryKey: ["cars", id],
    queryFn: () => apiFetch<Car | null>(`/api/cars/${id}`),
    enabled: !!id,
  });
}

// ── Mutations ──────────────────────────────────────────────────────────────

export function useCreateCar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (car: Omit<Car, "id">) =>
      apiFetch<Car>("/api/cars", {
        method: "POST",
        body: JSON.stringify(car),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: CARS_KEY }),
  });
}

export function useUpdateCar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }: Partial<Car> & { id: string }) =>
      apiFetch<Car>(`/api/cars/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: CARS_KEY }),
  });
}

export function useDeleteCar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/cars/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: CARS_KEY }),
  });
}
