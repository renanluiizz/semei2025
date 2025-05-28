
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

          const { data: profile, error } = await supabase
            .from('staff')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          clearTimeout(timeoutId);
          
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
              console.error('Erro ao buscar perfil do usuário:', error);
              // Se não encontrar o perfil na tabela staff, fazer logout
              await supabase.auth.signOut();
            }
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
        
        console.log('Auth state changed:', event, session?.user?.email);
        
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          // Buscar perfil do usuário de forma assíncrona
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const { data: profile, error } = await supabase
                .from('staff')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
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
                  console.error('Erro ao buscar perfil:', error);
                  // Se não encontrar o perfil na tabela staff, fazer logout
                  await supabase.auth.signOut();
                }
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
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Erro no signIn:', error);
        return { error };
      }

      // Verificar se o usuário existe na tabela staff
      if (data.user) {
        const { data: staffProfile, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (staffError || !staffProfile) {
          console.error('Usuário não encontrado na tabela staff:', staffError);
          await supabase.auth.signOut();
          return { 
            error: { 
              message: 'User not authorized',
              description: 'Usuário não autorizado a acessar o sistema.'
            } 
          };
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Erro inesperado no signIn:', error);
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
      console.error('Erro ao fazer logout:', error);
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
