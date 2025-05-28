
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
import { User, Lock, Eye, EyeOff } from 'lucide-react';
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
        
        // Mensagens de erro mais específicas e seguras
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Acesso ao Sistema</CardTitle>
          <CardDescription>
            Sistema de Gestão de Idosos
            <br />
            Secretaria de Assistência Social
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...form.register('email')}
                  id="email"
                  type="email"
                  placeholder="seu.email@municipio.gov.br"
                  className="pl-10"
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
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...form.register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
              <strong>Importante:</strong> Use apenas as credenciais fornecidas pelo administrador do sistema. 
              Mantenha suas informações de acesso seguras.
            </div>
          </CardContent>
          
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Entrando...
                </div>
              ) : (
                'Entrar no Sistema'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
