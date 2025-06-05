
export function AppFooter() {
  return (
    <footer className="px-6 lg:px-8 py-4 border-t border-slate-200/60 bg-white/60 backdrop-blur-xl">
      <div className="semei-container flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span className="font-medium">© 2024 Secretaria da Melhor Idade - SEMEI</span>
        <div className="flex items-center gap-4">
          <span className="font-medium">Sistema de Gestão Institucional v2.0</span>
          <span className="hidden sm:block">•</span>
          <span className="font-medium">Cabo Frio, RJ</span>
        </div>
      </div>
    </footer>
  );
}
