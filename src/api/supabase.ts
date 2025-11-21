import { createClient, SupabaseClient } from '@supabase/supabase-js';

// TODO: Replace with actual Supabase project URL and anon key
// These should come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock client if credentials are not configured
let supabase: SupabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  // Only show warning in development mode
  if (import.meta.env.DEV) {
    console.info(
      'ℹ️ Supabase credentials not configured. App will use local storage. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to enable cloud sync.'
    );
  }
  // Create a mock client that won't throw errors
  // This allows the app to run in development without Supabase
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

// Centralized API wrapper functions will be added here
export { supabase };
export type { SupabaseClient };

