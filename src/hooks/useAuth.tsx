
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
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

    // Verificar sessão inicial
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Buscar perfil do usuário com timeout
          const timeoutId = setTimeout(() => {
            if (mounted) {
              setLoading(false);
            }
          }, 5000);

          const { data: profile } = await supabase
            .from('staff')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          clearTimeout(timeoutId);
          
          if (mounted && profile) {
            setUserProfile({
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              role: profile.role as 'admin' | 'operator',
              created_at: profile.created_at
            });
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Listener para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Buscar perfil do usuário de forma assíncrona
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const { data: profile } = await supabase
                .from('staff')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (mounted && profile) {
                setUserProfile({
                  id: profile.id,
                  email: profile.email,
                  full_name: profile.full_name,
                  role: profile.role as 'admin' | 'operator',
                  created_at: profile.created_at
                });
              }
            } catch (error) {
              console.error('Erro ao buscar perfil:', error);
            }
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
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
