
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import { Login } from "@/pages/auth/Login";
import { PageLoading } from "@/components/ui/page-loading";
import { Suspense, lazy } from "react";

// Lazy loading das páginas para code splitting
const Dashboard = lazy(() => import("@/pages/Dashboard").then(module => ({ default: module.Dashboard })));
const IdososList = lazy(() => import("@/pages/idosos/IdososList").then(module => ({ default: module.IdososList })));
const IdosoDetails = lazy(() => import("@/pages/idosos/IdosoDetails"));
const EditIdoso = lazy(() => import("@/pages/idosos/EditIdoso"));
const NovoIdoso = lazy(() => import("@/pages/idosos/NovoIdoso").then(module => ({ default: module.NovoIdoso })));
const AtividadesList = lazy(() => import("@/pages/atividades/AtividadesList").then(module => ({ default: module.AtividadesList })));
const TiposAtividade = lazy(() => import("@/pages/TiposAtividade").then(module => ({ default: module.TiposAtividade })));
const Configuracoes = lazy(() => import("@/pages/Configuracoes"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Configuração otimizada do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={
                <Suspense fallback={<PageLoading />}>
                  <Dashboard />
                </Suspense>
              } />
              <Route path="idosos" element={
                <Suspense fallback={<PageLoading />}>
                  <IdososList />
                </Suspense>
              } />
              <Route path="idosos/novo" element={
                <Suspense fallback={<PageLoading />}>
                  <NovoIdoso />
                </Suspense>
              } />
              <Route path="idosos/:id" element={
                <Suspense fallback={<PageLoading />}>
                  <IdosoDetails />
                </Suspense>
              } />
              <Route path="idosos/:id/editar" element={
                <Suspense fallback={<PageLoading />}>
                  <EditIdoso />
                </Suspense>
              } />
              <Route path="atividades" element={
                <Suspense fallback={<PageLoading />}>
                  <AtividadesList />
                </Suspense>
              } />
              <Route path="tipos-atividade" element={
                <Suspense fallback={<PageLoading />}>
                  <TiposAtividade />
                </Suspense>
              } />
              <Route path="configuracoes" element={
                <Suspense fallback={<PageLoading />}>
                  <Configuracoes />
                </Suspense>
              } />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={
              <Suspense fallback={<PageLoading />}>
                <NotFound />
              </Suspense>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
