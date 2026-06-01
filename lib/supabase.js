import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// During build the env vars may be missing; we create the client lazily/safely.
export const supabase =
  url && anonKey ? createClient(url, anonKey) : null;

export const isConfigured = Boolean(url && anonKey);
