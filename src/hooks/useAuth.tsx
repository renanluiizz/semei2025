
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Usuario } from '@/types/models';

interface AuthContextType {
  user: User | null;
  userProfile: Usuario | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
        }
        
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const { data: profile, error } = await supabase
              .from('staff')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (mounted) {
              if (profile && !error) {
                setUserProfile({
                  id: profile.id,
                  email: profile.email,
                  full_name: profile.full_name,
                  role: profile.role as 'admin' | 'operator',
                  created_at: profile.created_at
                });
              } else if (error) {
                console.error('Error fetching user profile:', error);
              }
            }
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email || 'no user');
        
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          // Fetch user profile
          const fetchProfile = async () => {
            try {
              const { data: profile, error } = await supabase
                .from('staff')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (mounted) {
                if (profile && !error) {
                  setUserProfile({
                    id: profile.id,
                    email: profile.email,
                    full_name: profile.full_name,
                    role: profile.role as 'admin' | 'operator',
                    created_at: profile.created_at
                  });
                } else if (error) {
                  console.error('Error fetching profile:', error);
                }
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
            }
          };
          
          fetchProfile();
        } else {
          setUserProfile(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Error signing in:', error);
        return { error };
      }

      // Check if user exists in staff table
      if (data.user) {
        const { data: staffProfile, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (staffError) {
          console.error('Error checking staff table:', staffError);
          // Don't block login for database errors
        }

        if (!staffProfile && !staffError) {
          console.log('User not found in staff table, creating record...');
          // Try to create staff record if it doesn't exist
          const { error: insertError } = await supabase
            .from('staff')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: data.user.user_metadata?.full_name || data.user.email!.split('@')[0],
              role: 'operator',
              status: 'active'
            });

          if (insertError && !insertError.message.includes('duplicate key')) {
            console.error('Error creating staff record:', insertError);
            // Don't block login, user might still be valid
          }
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error signing in:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    user,
    userProfile,
    loading,
    signIn,
    signOut,
  }), [user, userProfile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
