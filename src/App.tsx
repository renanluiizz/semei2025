
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from '@/components/ui/sonner';

// Lazy imports para melhorar performance
import { lazy, Suspense } from 'react';
import { PageLoading } from '@/components/ui/page-loading';

// Páginas lazy-loaded com exports nomeados corrigidos
const Login = lazy(() => import('@/pages/auth/Login').then(module => ({ default: module.Login })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const IdososList = lazy(() => import('@/pages/idosos/IdososList').then(module => ({ default: module.IdososList })));
const NovoIdoso = lazy(() => import('@/pages/idosos/NovoIdoso').then(module => ({ default: module.NovoIdoso })));
const EditIdoso = lazy(() => import('@/pages/idosos/EditIdoso'));
const IdosoDetails = lazy(() => import('@/pages/idosos/IdosoDetails'));
const AtividadesList = lazy(() => import('@/pages/atividades/AtividadesList').then(module => ({ default: module.AtividadesList })));
const TiposAtividade = lazy(() => import('@/pages/TiposAtividade'));
const ServidoresPage = lazy(() => import('@/pages/ServidoresPage'));
const AuditoriaPage = lazy(() => import('@/pages/AuditoriaPage'));
const ImportarPage = lazy(() => import('@/pages/ImportarPage'));
const ResetarPage = lazy(() => import('@/pages/ResetarPage'));
const Configuracoes = lazy(() => import('@/pages/Configuracoes').then(module => ({ default: module.Configuracoes })));

// Query client otimizado
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

console.log('🚀 Starting SEMEI application...');

function App() {
  console.log('🎯 App component rendering...');

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Suspense fallback={<PageLoading />}>
              <Routes>
                {/* Rota pública de login */}
                <Route path="/login" element={<Login />} />
                
                {/* Rotas protegidas */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Routes>
                        {/* Dashboard */}
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        
                        {/* Idosos */}
                        <Route path="/idosos" element={<IdososList />} />
                        <Route path="/idosos/novo" element={<NovoIdoso />} />
                        <Route path="/idosos/:id/editar" element={<EditIdoso />} />
                        <Route path="/idosos/:id" element={<IdosoDetails />} />
                        
                        {/* Atividades */}
                        <Route path="/atividades" element={<AtividadesList />} />
                        <Route path="/tipos-atividade" element={<TiposAtividade />} />
                        
                        {/* Administração */}
                        <Route path="/servidores" element={<ServidoresPage />} />
                        <Route path="/auditoria" element={<AuditoriaPage />} />
                        <Route path="/importar" element={<ImportarPage />} />
                        <Route path="/resetar" element={<ResetarPage />} />
                        <Route path="/configuracoes" element={<Configuracoes />} />
                      </Routes>
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </div>
          
          {/* Toast notifications */}
          <Toaster 
            position="top-right"
            richColors
            expand={false}
            duration={4000}
            closeButton
          />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

console.log('✅ SEMEI application started successfully');

export default App;
