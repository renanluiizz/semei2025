
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageLoading } from '@/components/ui/page-loading';

// Lazy load pages
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Login = lazy(() => import('@/pages/auth/Login').then(module => ({ default: module.Login })));
const IdososList = lazy(() => import('@/pages/idosos/IdososList').then(module => ({ default: module.IdososList })));
const NovoIdoso = lazy(() => import('@/pages/idosos/NovoIdoso').then(module => ({ default: module.NovoIdoso })));
const EditIdoso = lazy(() => import('@/pages/idosos/EditIdoso'));
const IdosoDetails = lazy(() => import('@/pages/idosos/IdosoDetails'));
const AtividadesList = lazy(() => import('@/pages/atividades/AtividadesList').then(module => ({ default: module.AtividadesList })));
const TiposAtividade = lazy(() => import('@/pages/TiposAtividade'));
const Configuracoes = lazy(() => import('@/pages/Configuracoes').then(module => ({ default: module.Configuracoes })));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Administrative pages
const ImportarPage = lazy(() => import('@/pages/ImportarPage'));
const ResetarPage = lazy(() => import('@/pages/ResetarPage'));
const AuditoriaPage = lazy(() => import('@/pages/AuditoriaPage'));
const ServidoresPage = lazy(() => import('@/pages/ServidoresPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="idosos" element={<IdososList />} />
                        <Route path="idosos/novo" element={<NovoIdoso />} />
                        <Route path="idosos/:id" element={<IdosoDetails />} />
                        <Route path="idosos/:id/editar" element={<EditIdoso />} />
                        <Route path="atividades" element={<AtividadesList />} />
                        <Route path="tipos-atividade" element={<TiposAtividade />} />
                        <Route path="importar" element={<ImportarPage />} />
                        <Route path="resetar" element={<ResetarPage />} />
                        <Route path="auditoria" element={<AuditoriaPage />} />
                        <Route path="servidores" element={<ServidoresPage />} />
                        <Route path="configuracoes" element={<Configuracoes />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
