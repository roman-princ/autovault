import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Dealership } from "@/data/cars";

export interface PublicDealership {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  heroSubtitle: string;
  address: string;
  phone: string;
  createdAt: string;
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export function useDealership(slug: string | undefined) {
  return useQuery({
    queryKey: ["dealership", slug],
    queryFn: () => apiFetch<Dealership>(`/api/dealerships/${slug}`),
    enabled: !!slug,
  });
}

export function useMyDealerships(email: string | undefined) {
  return useQuery({
    queryKey: ["my-dealerships", email],
    queryFn: () =>
      apiFetch<Dealership[]>(
        `/api/dealerships?ownerEmail=${encodeURIComponent(email!)}`,
      ),
    enabled: !!email,
  });
}

export function usePublicDealerships() {
  return useQuery({
    queryKey: ["public-dealerships"],
    queryFn: () => apiFetch<PublicDealership[]>("/api/public/dealerships"),
  });
}

export function useRegisterDealership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<Dealership, "name" | "slug" | "ownerEmail"> &
        Partial<Pick<Dealership, "phone" | "address">>,
    ) =>
      apiFetch<Dealership>("/api/dealerships", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: ["my-dealerships", vars.ownerEmail] }),
  });
}

export function useUpdateDealership(slug: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Dealership>) =>
      apiFetch<Dealership>(`/api/dealerships/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dealership", slug] }),
  });
}
