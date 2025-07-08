
import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2, Shield } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = useCallback(async (data: LoginForm) => {
    if (isLoading) return;
    
    console.log('Login attempt for:', data.email);
    setIsLoading(true);
    
    try {
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
          errorDescription = 'Verifique seu email e confirme sua conta antes de fazer login.';
        } else if (error.message === 'Too many requests') {
          errorMessage = 'Muitas tentativas';
          errorDescription = 'Aguarde alguns minutos antes de tentar novamente.';
        }

        toast.error(errorMessage, {
          description: errorDescription,
        });
        return;
      }

      console.log('Login successful, redirecting to:', from);
      toast.success('Login realizado com sucesso!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('Erro interno do sistema', {
        description: 'Tente novamente em alguns instantes.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [signIn, navigate, from, isLoading]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
      
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in border border-border">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Sistema SEMEI
          </h1>
          <p className="text-sm text-muted-foreground">
            Secretaria da Melhor Idade - Cabo Frio
          </p>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-foreground mb-2"
            >
              E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                {...form.register('email')}
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-background text-foreground"
                disabled={isLoading}
              />
            </div>
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          
          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-foreground mb-2"
            >
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                {...form.register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-12 py-3 border border-input rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-background text-foreground"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Sistema de Gestão da Secretaria da Melhor Idade
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Prefeitura Municipal de Cabo Frio - 2025
          </p>
        </div>
      </div>
    </div>
  );
}
