
import { supabase } from '@/integrations/supabase/client';

// Auth helper functions
export const authHelpers = {
  signIn: async (email: string, password: string) => {
    try {
      console.log('Auth helper - signing in:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Auth helper - sign in error:', error);
        return { data: null, error };
      }

      console.log('Auth helper - sign in successful:', data.user?.email);
      return { data, error: null };
    } catch (error) {
      console.error('Auth helper - unexpected error:', error);
      return { data: null, error };
    }
  },

  signOut: async () => {
    try {
      console.log('Auth helper - signing out');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Auth helper - sign out error:', error);
        return { error };
      }
      
      console.log('Auth helper - sign out successful');
      return { error: null };
    } catch (error) {
      console.error('Auth helper - unexpected sign out error:', error);
      return { error };
    }
  },

  getCurrentUser: async () => {
    try {
      console.log('Auth helper - getting current user');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Auth helper - get user error:', error);
        return { user: null, error };
      }
      
      console.log('Auth helper - current user:', user?.email || 'no user');
      return { user, error: null };
    } catch (error) {
      console.error('Auth helper - unexpected get user error:', error);
      return { user: null, error };
    }
  },

  getSession: async () => {
    try {
      console.log('Auth helper - getting session');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth helper - get session error:', error);
        return { session: null, error };
      }
      
      console.log('Auth helper - session:', session?.user?.email || 'no session');
      return { session, error: null };
    } catch (error) {
      console.error('Auth helper - unexpected get session error:', error);
      return { session: null, error };
    }
  },
};
