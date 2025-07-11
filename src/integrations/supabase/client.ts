
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jdhwerigsegxfkkjcatw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaHdlcmlnc2VneGZra2pjYXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzA1MzIsImV4cCI6MjA2Njk0NjUzMn0.X9v1jH9Eo6G47wDVsG2yr5jo1tWJjhZsL0EkkD1v0P0";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-my-custom-header': 'semei-system',
    },
  },
});

// Log connection status
console.log('Supabase client initialized successfully');
console.log('Supabase URL:', SUPABASE_URL);
console.log('Auth config:', supabase.auth);
