
export function SemeiFooter() {
  return (
    <footer className="bg-white border-t border-slate-200/60 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 gap-2">
        <span className="font-medium">© 2025 Prefeitura Municipal de Cabo Frio — SEMEI</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-blue-600 transition-colors rounded-lg px-2 py-1">
            Política de Privacidade
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors rounded-lg px-2 py-1">
            Suporte Técnico
          </a>
        </div>
      </div>
    </footer>
  );
}
