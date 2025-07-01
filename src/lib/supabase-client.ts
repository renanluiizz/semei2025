
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://jdhwerigsegxfkkjcatw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaHdlcmlnc2VneGZra2pjYXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzA1MzIsImV4cCI6MjA2Njk0NjUzMn0.X9v1jH9Eo6G47wDVsG2yr5jo1tWJjhZsL0EkkD1v0P0";

export const supabaseClient: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Re-export for consistency
export { supabaseClient as supabase };
