import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

// Only the public anon key is used on the client; data access is protected by RLS.
export const supabase = isSupabaseConfigured ? createClient(url!, anonKey!) : null;
