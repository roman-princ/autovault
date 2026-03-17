import { createClient } from "@supabase/supabase-js";

type SupabaseClient = ReturnType<typeof createClient>;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const missingSupabaseEnvMessage =
  "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars";

function createMissingEnvClient(): SupabaseClient {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(missingSupabaseEnvMessage);
      },
    },
  ) as SupabaseClient;
}

export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMissingEnvClient();
