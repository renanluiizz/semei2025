
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import PageLoading from '@/components/ui/page-loading';

// Lazy load pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Login = lazy(() => import('@/pages/auth/Login'));
const IdososList = lazy(() => import('@/pages/idosos/IdososList'));
const NovoIdoso = lazy(() => import('@/pages/idosos/NovoIdoso'));
const EditIdoso = lazy(() => import('@/pages/idosos/EditIdoso'));
const IdosoDetails = lazy(() => import('@/pages/idosos/IdosoDetails'));
const AtividadesList = lazy(() => import('@/pages/atividades/AtividadesList'));
const TiposAtividade = lazy(() => import('@/pages/TiposAtividade'));
const Configuracoes = lazy(() => import('@/pages/Configuracoes'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Páginas para correção dos problemas
const ImportarPage = lazy(() => import('@/pages/ImportarPage'));
const ResetarPage = lazy(() => import('@/pages/ResetarPage'));

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
          <div className="App">
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
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
                  <Route path="configuracoes" element={<Configuracoes />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
