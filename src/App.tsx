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
          <div className="App min-h-screen bg-background">
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/idosos" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <IdososList />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/idosos/novo" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <NovoIdoso />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/idosos/:id" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <IdosoDetails />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/idosos/:id/editar" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <EditIdoso />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/atividades" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AtividadesList />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tipos-atividade" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <TiposAtividade />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/importar" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ImportarPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/resetar" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ResetarPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/auditoria" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AuditoriaPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/servidores" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ServidoresPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/configuracoes" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Configuracoes />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="*" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <NotFound />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  color: 'hsl(var(--foreground))',
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