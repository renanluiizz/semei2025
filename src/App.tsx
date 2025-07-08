
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageLoading } from '@/components/ui/page-loading';

// Lazy load pages with better error handling
const Dashboard = lazy(() => 
  import('@/pages/Dashboard').then(module => ({ default: module.Dashboard }))
    .catch(error => {
      console.error('Failed to load Dashboard:', error);
      return { default: () => <div>Erro ao carregar Dashboard</div> };
    })
);

const Login = lazy(() => 
  import('@/pages/auth/Login').then(module => ({ default: module.Login }))
    .catch(error => {
      console.error('Failed to load Login:', error);
      return { default: () => <div>Erro ao carregar Login</div> };
    })
);

const IdososList = lazy(() => 
  import('@/pages/idosos/IdososList').then(module => ({ default: module.IdososList }))
    .catch(error => {
      console.error('Failed to load IdososList:', error);
      return { default: () => <div>Erro ao carregar Lista de Idosos</div> };
    })
);

const NovoIdoso = lazy(() => 
  import('@/pages/idosos/NovoIdoso').then(module => ({ default: module.NovoIdoso }))
    .catch(error => {
      console.error('Failed to load NovoIdoso:', error);
      return { default: () => <div>Erro ao carregar Novo Idoso</div> };
    })
);

const EditIdoso = lazy(() => 
  import('@/pages/idosos/EditIdoso')
    .catch(error => {
      console.error('Failed to load EditIdoso:', error);
      return { default: () => <div>Erro ao carregar Editar Idoso</div> };
    })
);

const IdosoDetails = lazy(() => 
  import('@/pages/idosos/IdosoDetails')
    .catch(error => {
      console.error('Failed to load IdosoDetails:', error);
      return { default: () => <div>Erro ao carregar Detalhes do Idoso</div> };
    })
);

const AtividadesList = lazy(() => 
  import('@/pages/atividades/AtividadesList').then(module => ({ default: module.AtividadesList }))
    .catch(error => {
      console.error('Failed to load AtividadesList:', error);
      return { default: () => <div>Erro ao carregar Lista de Atividades</div> };
    })
);

const TiposAtividade = lazy(() => 
  import('@/pages/TiposAtividade')
    .catch(error => {
      console.error('Failed to load TiposAtividade:', error);
      return { default: () => <div>Erro ao carregar Tipos de Atividade</div> };
    })
);

const Configuracoes = lazy(() => 
  import('@/pages/Configuracoes').then(module => ({ default: module.Configuracoes }))
    .catch(error => {
      console.error('Failed to load Configuracoes:', error);
      return { default: () => <div>Erro ao carregar Configurações</div> };
    })
);

const NotFound = lazy(() => 
  import('@/pages/NotFound')
    .catch(error => {
      console.error('Failed to load NotFound:', error);
      return { default: () => <div>Página não encontrada</div> };
    })
);

// Administrative pages
const ImportarPage = lazy(() => 
  import('@/pages/ImportarPage')
    .catch(error => {
      console.error('Failed to load ImportarPage:', error);
      return { default: () => <div>Erro ao carregar Importar</div> };
    })
);

const ResetarPage = lazy(() => 
  import('@/pages/ResetarPage')
    .catch(error => {
      console.error('Failed to load ResetarPage:', error);
      return { default: () => <div>Erro ao carregar Resetar</div> };
    })
);

const AuditoriaPage = lazy(() => 
  import('@/pages/AuditoriaPage')
    .catch(error => {
      console.error('Failed to load AuditoriaPage:', error);
      return { default: () => <div>Erro ao carregar Auditoria</div> };
    })
);

const ServidoresPage = lazy(() => 
  import('@/pages/ServidoresPage')
    .catch(error => {
      console.error('Failed to load ServidoresPage:', error);
      return { default: () => <div>Erro ao carregar Servidores</div> };
    })
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  console.log('App component rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-background text-foreground">
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
                <Route path="*" element={<NotFound />} />
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
