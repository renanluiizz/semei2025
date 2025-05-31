
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageLoading } from '@/components/ui/page-loading';

// Lazy load pages with proper error handling
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.default || module.Dashboard || module })));
const Login = lazy(() => import('@/pages/auth/Login').then(module => ({ default: module.default || module.Login || module })));
const IdososList = lazy(() => import('@/pages/idosos/IdososList').then(module => ({ default: module.default || module.IdososList || module })));
const NovoIdoso = lazy(() => import('@/pages/idosos/NovoIdoso').then(module => ({ default: module.default || module.NovoIdoso || module })));
const EditIdoso = lazy(() => import('@/pages/idosos/EditIdoso').then(module => ({ default: module.default || module.EditIdoso || module })));
const IdosoDetails = lazy(() => import('@/pages/idosos/IdosoDetails').then(module => ({ default: module.default || module.IdosoDetails || module })));
const AtividadesList = lazy(() => import('@/pages/atividades/AtividadesList').then(module => ({ default: module.default || module.AtividadesList || module })));
const TiposAtividade = lazy(() => import('@/pages/TiposAtividade').then(module => ({ default: module.default || module.TiposAtividade || module })));
const Configuracoes = lazy(() => import('@/pages/Configuracoes').then(module => ({ default: module.default || module.Configuracoes || module })));
const NotFound = lazy(() => import('@/pages/NotFound').then(module => ({ default: module.default || module.NotFound || module })));

// Páginas para correção dos problemas
const ImportarPage = lazy(() => import('@/pages/ImportarPage').then(module => ({ default: module.default || module.ImportarPage || module })));
const ResetarPage = lazy(() => import('@/pages/ResetarPage').then(module => ({ default: module.default || module.ResetarPage || module })));

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
                <Route path="/auth/login" element={<Login />} />
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
