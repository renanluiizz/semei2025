
import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User, Lock, Eye, EyeOff, Heart } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
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
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        console.error('Erro de login:', error);
        
        let errorMessage = 'Erro ao fazer login';
        let errorDescription = 'Verifique suas credenciais e tente novamente';

        if (error.message === 'Invalid login credentials') {
          errorMessage = 'Credenciais inválidas';
          errorDescription = 'Email ou senha incorretos. Verifique os dados e tente novamente.';
        } else if (error.message === 'Email not confirmed') {
          errorMessage = 'Email não confirmado';
          errorDescription = 'Verifique sua caixa de entrada e confirme seu email antes de fazer login.';
        } else if (error.message === 'Too many requests') {
          errorMessage = 'Muitas tentativas';
          errorDescription = 'Aguarde alguns minutos antes de tentar novamente.';
        }

        toast.error(errorMessage, {
          description: errorDescription,
        });
        return;
      }

      toast.success('Login realizado com sucesso!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      toast.error('Erro interno do sistema', {
        description: 'Tente novamente em alguns instantes ou contate o administrador.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [signIn, navigate, from, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SEMEI
            </CardTitle>
            <CardDescription className="text-lg font-medium text-gray-700 mt-2">
              Secretaria da Melhor Idade
            </CardDescription>
            <p className="text-sm text-gray-500 mt-1">
              Sistema de Gestão Institucional
            </p>
          </div>
        </CardHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...form.register('email')}
                  id="email"
                  type="email"
                  placeholder="seu.email@semei.gov.br"
                  className="pl-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...form.register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent rounded-xl"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="text-xs text-gray-500 bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-xl border border-primary/10">
              <strong>Importante:</strong> Use apenas as credenciais fornecidas pelo administrador do sistema SEMEI. 
              Mantenha suas informações de acesso seguras.
            </div>
          </CardContent>
          
          <CardFooter className="pt-0">
            <Button
              type="submit"
              className="w-full semei-button bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Entrando no Sistema...
                </div>
              ) : (
                'Entrar no Sistema SEMEI'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
