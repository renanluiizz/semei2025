
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthProvider } from '@/hooks/useAuth';

// Lazy loading de páginas
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/auth/Login').then(module => ({ default: module.Login })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const IdososList = lazy(() => import('@/pages/idosos/IdososList').then(module => ({ default: module.default })));
const NovoIdoso = lazy(() => import('@/pages/idosos/NovoIdoso').then(module => ({ default: module.default })));
const EditIdoso = lazy(() => import('@/pages/idosos/EditIdoso'));
const IdosoDetails = lazy(() => import('@/pages/idosos/IdosoDetails'));
const AtividadesList = lazy(() => import('@/pages/atividades/AtividadesList').then(module => ({ default: module.default })));
const TiposAtividade = lazy(() => import('@/pages/TiposAtividade').then(module => ({ default: module.TiposAtividade })));
const Configuracoes = lazy(() => import('@/pages/Configuracoes').then(module => ({ default: module.Configuracoes })));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="text-lg font-medium text-primary">Carregando SEMEI...</span>
                  </div>
                </div>
              }>
                <Routes>
                  {/* Rota pública - Index */}
                  <Route path="/" element={<Index />} />
                  
                  {/* Rota de autenticação */}
                  <Route path="/auth/login" element={<Login />} />
                  
                  {/* Rotas protegidas */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="idosos" element={<IdososList />} />
                    <Route path="idosos/novo" element={<NovoIdoso />} />
                    <Route path="idosos/:id/editar" element={<EditIdoso />} />
                    <Route path="idosos/:id" element={<IdosoDetails />} />
                    <Route path="atividades" element={<AtividadesList />} />
                    <Route path="tipos-atividade" element={<TiposAtividade />} />
                    <Route path="configuracoes" element={<Configuracoes />} />
                  </Route>
                  
                  {/* Redirect para dashboard se logado */}
                  <Route path="/app" element={<Navigate to="/dashboard" replace />} />
                  
                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
