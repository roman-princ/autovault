import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Dealership } from "@/data/cars";
import { supabase } from "@/lib/supabase";

export interface PublicDealership {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  heroSubtitle: string;
  aboutUs: string;
  address: string;
  phone: string;
  createdAt: string;
}

type DealershipRow = {
  id: string;
  name: string;
  slug: string;
  owner_email: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  hero_title: string;
  hero_subtitle: string;
  phone: string;
  address: string;
  about_us: string;
  created_at: string;
};

function mapDealership(row: DealershipRow): Dealership {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    ownerEmail: row.owner_email,
    logoUrl: row.logo_url,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    heroTitle: row.hero_title,
    heroSubtitle: row.hero_subtitle,
    phone: row.phone,
    address: row.address,
    aboutUs: row.about_us,
    createdAt: row.created_at,
  };
}

function mapPublicDealership(row: DealershipRow): PublicDealership {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logo_url,
    primaryColor: row.primary_color,
    heroSubtitle: row.hero_subtitle,
    aboutUs: row.about_us,
    address: row.address,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

export function useDealership(slug: string | undefined) {
  return useQuery({
    queryKey: ["dealership", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dealerships")
        .select("*")
        .eq("slug", slug!)
        .single();

      if (error) throw new Error(error.message);
      return mapDealership(data as DealershipRow);
    },
    enabled: !!slug,
  });
}

export function useMyDealerships(email: string | undefined) {
  return useQuery({
    queryKey: ["my-dealerships", email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dealerships")
        .select("*")
        .eq("owner_email", email!)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return ((data ?? []) as DealershipRow[]).map(mapDealership);
    },
    enabled: !!email,
  });
}

export function usePublicDealerships() {
  return useQuery({
    queryKey: ["public-dealerships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dealerships")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return ((data ?? []) as DealershipRow[]).map(mapPublicDealership);
    },
  });
}

export function useRegisterDealership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<Dealership, "name" | "slug" | "ownerEmail"> &
        Partial<Pick<Dealership, "phone" | "address">>,
    ) =>
      (async () => {
        const { data: inserted, error } = await supabase
          .from("dealerships")
          .insert({
            name: data.name,
            slug: data.slug,
            owner_email: data.ownerEmail,
            phone: data.phone ?? "",
            address: data.address ?? "",
          })
          .select("*")
          .single();

        if (error) throw new Error(error.message);
        return mapDealership(inserted as DealershipRow);
      })(),
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: ["my-dealerships", vars.ownerEmail] }),
  });
}

export function useUpdateDealership(slug: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<Dealership>) => {
      const dbUpdates: Record<string, unknown> = {};

      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
      if (updates.primaryColor !== undefined)
        dbUpdates.primary_color = updates.primaryColor;
      if (updates.secondaryColor !== undefined)
        dbUpdates.secondary_color = updates.secondaryColor;
      if (updates.heroTitle !== undefined)
        dbUpdates.hero_title = updates.heroTitle;
      if (updates.heroSubtitle !== undefined)
        dbUpdates.hero_subtitle = updates.heroSubtitle;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.address !== undefined) dbUpdates.address = updates.address;
      if (updates.aboutUs !== undefined) dbUpdates.about_us = updates.aboutUs;

      const { data, error } = await supabase
        .from("dealerships")
        .update(dbUpdates)
        .eq("slug", slug!)
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      return mapDealership(data as DealershipRow);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dealership", slug] }),
  });
}
