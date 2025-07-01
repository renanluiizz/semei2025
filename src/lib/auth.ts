
import { supabaseClient } from '@/lib/supabase-client';

// Auth helper functions
export const authHelpers = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabaseClient.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    return { user, error };
  },
};
