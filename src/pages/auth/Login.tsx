
import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email institucional inválido'),
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Background gradiente institucional opcional */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-50" />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
        {/* Logo Institucional */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">CF</span>
          </div>
        </div>
        
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Acesso ao Sistema SEMEI
          </h1>
          <p className="text-sm text-gray-600">
            Secretaria da Melhor Idade - Cabo Frio
          </p>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo E-mail */}
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
                aria-describedby={form.formState.errors.email ? 'email-error' : undefined}
              />
            </div>
            {form.formState.errors.email && (
              <p 
                id="email-error" 
                role="alert" 
                className="mt-1 text-sm text-red-600"
              >
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          
          {/* Campo Senha */}
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
                autoComplete="current-password"
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={isLoading}
                aria-describedby={form.formState.errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p 
                id="password-error" 
                role="alert" 
                className="mt-1 text-sm text-red-600"
              >
                {form.formState.errors.password.message}
              </p>
            )}
            
            {/* Link Esqueceu a senha */}
            <div className="mt-2">
              <a 
                href="#" 
                className="text-sm text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info('Funcionalidade em desenvolvimento', {
                    description: 'Entre em contato com o administrador do sistema.'
                  });
                }}
              >
                Esqueceu a senha?
              </a>
            </div>
          </div>
          
          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
        
        {/* Informações adicionais */}
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
