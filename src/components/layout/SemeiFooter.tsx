
export function SemeiFooter() {
  return (
    <footer className="bg-white/60 backdrop-blur-xl border-t border-slate-200/60 px-6 lg:px-8 py-4">
      <div className="semei-container flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 gap-2">
        <span className="font-semibold">© 2025 Prefeitura Municipal de Cabo Frio — SEMEI</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-blue-600 transition-colors rounded-lg px-2 py-1 font-medium">
            Política de Privacidade
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors rounded-lg px-2 py-1 font-medium">
            Suporte Técnico
          </a>
        </div>
      </div>
    </footer>
  );
}
