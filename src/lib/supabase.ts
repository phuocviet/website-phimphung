import { createClient } from '@supabase/supabase-js';

// Default to project publishable credentials if environment variables are not set on hosting
const DEFAULT_URL = 'https://xkcbcqkpjbvdwlqdttta.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_x-T0041og9gVAnEDeceDVg_5Iuvr8RM';

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_URL;
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// The publishable key is safe for client-side use; data security is strictly enforced by Supabase RLS.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
