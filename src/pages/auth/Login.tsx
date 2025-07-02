
import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const authSchema = z.object({
  email: z.string().email('Email institucional inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
});

type AuthForm = z.infer<typeof authSchema>;

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const form = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
    },
  });

  const onSubmit = useCallback(async (data: AuthForm) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Handle signup
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName || data.email.split('@')[0],
            },
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (error) {
          console.error('Signup error:', error);
          let errorMessage = 'Erro ao criar conta';
          let errorDescription = 'Verifique os dados e tente novamente';

          if (error.message === 'User already registered') {
            errorMessage = 'Usuário já cadastrado';
            errorDescription = 'Este email já está cadastrado. Tente fazer login.';
          }

          toast.error(errorMessage, {
            description: errorDescription,
          });
          return;
        }

        if (authData.user) {
          // Manually insert into staff table if trigger didn't work
          const { error: staffError } = await supabase
            .from('staff')
            .insert({
              id: authData.user.id,
              email: authData.user.email!,
              full_name: data.fullName || authData.user.email!.split('@')[0],
              role: 'operator',
              status: 'active'
            });

          if (staffError && !staffError.message.includes('duplicate key')) {
            console.error('Error creating staff record:', staffError);
            toast.error('Erro ao criar perfil de usuário', {
              description: 'Tente novamente ou contate o administrador.',
            });
            return;
          }

          toast.success('Conta criada com sucesso!', {
            description: 'Você foi logado automaticamente.',
          });
          navigate(from, { replace: true });
        }
      } else {
        // Handle signin
        const { error } = await signIn(data.email, data.password);
        
        if (error) {
          console.error('Login error:', error);
          
          let errorMessage = 'Erro ao fazer login';
          let errorDescription = 'Verifique suas credenciais e tente novamente';

          if (error.message === 'Invalid login credentials') {
            errorMessage = 'Credenciais inválidas';
            errorDescription = 'Email ou senha incorretos. Verifique os dados e tente novamente.';
          } else if (error.message === 'Email not confirmed') {
            errorMessage = 'Email não confirmado';
            errorDescription = 'Email não confirmado. Contate o administrador para ativar sua conta.';
          } else if (error.message === 'Too many requests') {
            errorMessage = 'Muitas tentativas';
            errorDescription = 'Aguarde alguns minutos antes de tentar novamente.';
          } else if (error.message === 'User not authorized') {
            errorMessage = 'Acesso não autorizado';
            errorDescription = error.description || 'Usuário não autorizado a acessar o sistema.';
          }

          toast.error(errorMessage, {
            description: errorDescription,
          });
          return;
        }

        toast.success('Login realizado com sucesso!');
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Unexpected auth error:', error);
      toast.error('Erro interno do sistema', {
        description: 'Tente novamente em alguns instantes ou contate o administrador.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [signIn, navigate, from, isLoading, isSignUp]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-50" />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">CF</span>
          </div>
        </div>
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {isSignUp ? 'Criar Conta' : 'Acesso ao Sistema SEMEI'}
          </h1>
          <p className="text-sm text-gray-600">
            Secretaria da Melhor Idade - Cabo Frio
          </p>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name (only for signup) */}
          {isSignUp && (
            <div>
              <label 
                htmlFor="fullName" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nome Completo
              </label>
              <input
                {...form.register('fullName')}
                id="fullName"
                type="text"
                placeholder="Seu nome completo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={isLoading}
              />
              {form.formState.errors.fullName && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              E-mail Institucional
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...form.register('email')}
                id="email"
                type="email"
                placeholder="seuemail@cabofrio.rj.gov.br"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={isLoading}
              />
            </div>
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          
          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...form.register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                {isSignUp ? 'Criando conta...' : 'Entrando...'}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                {isSignUp ? <UserPlus className="h-5 w-5" /> : null}
                {isSignUp ? 'Criar Conta' : 'Entrar'}
              </div>
            )}
          </button>

          {/* Toggle between login/signup */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                form.reset();
              }}
              className="text-sm text-blue-600 hover:underline"
              disabled={isLoading}
            >
              {isSignUp 
                ? 'Já tem uma conta? Fazer login' 
                : 'Não tem conta? Criar uma nova'
              }
            </button>
          </div>
        </form>
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Sistema de Gestão da Secretaria da Melhor Idade
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Prefeitura Municipal de Cabo Frio
          </p>
        </div>
      </div>
    </div>
  );
}
