
export function SemeiFooter() {
  return (
    <footer className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 px-8 py-6">
      <div className="semei-container flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="font-semibold">© 2025 Prefeitura Municipal de Cabo Frio — SEMEI</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-blue-600 transition-colors rounded-lg px-3 py-2 font-medium hover:bg-blue-50">
            Política de Privacidade
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors rounded-lg px-3 py-2 font-medium hover:bg-blue-50">
            Suporte Técnico
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors rounded-lg px-3 py-2 font-medium hover:bg-blue-50">
            Versão 2.0.1
          </a>
        </div>
      </div>
    </footer>
  );
}
