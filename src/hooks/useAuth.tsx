
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
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Cache do perfil para evitar queries desnecessárias
  const profileCache = useMemo(() => new Map<string, Usuario>(), []);

  // Fetch user profile otimizado com cache
  const fetchUserProfile = async (userId: string): Promise<Usuario | null> => {
    try {
      // Verificar cache primeiro
      if (profileCache.has(userId)) {
        console.log('📋 Using cached profile for user:', userId);
        return profileCache.get(userId)!;
      }

      console.log('🔍 Fetching fresh profile for user:', userId);
      
      const { data: profile, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        return null;
      }

      if (profile) {
        const userProfile: Usuario = {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role as 'admin' | 'operator',
          created_at: profile.created_at
        };
        
        // Salvar no cache
        profileCache.set(userId, userProfile);
        console.log('✅ User profile cached:', userProfile);
        return userProfile;
      }

      return null;
    } catch (error) {
      console.error('❌ Unexpected error fetching profile:', error);
      return null;
    }
  };

  // Initialize auth state otimizado
  useEffect(() => {
    console.log('🚀 Initializing auth state...');
    
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
        }

        if (isMounted) {
          console.log('📋 Initial session:', session?.user?.email || 'no user');
          
          if (session?.user) {
            setUser(session.user);
            
            // Fetch profile de forma assíncrona
            fetchUserProfile(session.user.id).then(profile => {
              if (isMounted) {
                setUserProfile(profile);
              }
            }).catch(error => {
              console.error('❌ Profile fetch error:', error);
              if (isMounted) {
                setUserProfile(null);
              }
            });
          } else {
            setUser(null);
            setUserProfile(null);
          }
          
          setInitialized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (isMounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes otimizado
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'no user');
        
        if (session?.user) {
          setUser(session.user);
          
          // Buscar perfil de forma não bloqueante
          setTimeout(() => {
            fetchUserProfile(session.user.id).then(profile => {
              if (isMounted) {
                setUserProfile(profile);
              }
            }).catch(error => {
              console.error('❌ Profile fetch error during auth change:', error);
              if (isMounted) {
                setUserProfile(null);
              }
            });
          }, 0);
        } else {
          setUser(null);
          setUserProfile(null);
          profileCache.clear(); // Limpar cache no logout
        }
        
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [profileCache]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in for:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        return { error };
      }

      console.log('✅ Sign in successful:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
      }
      
      setUser(null);
      setUserProfile(null);
      profileCache.clear(); // Limpar cache
      
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Unexpected sign out error:', error);
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
    initialized,
  }), [user, userProfile, loading, initialized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
