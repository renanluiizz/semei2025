
export function SemeiFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-2">
        <span>© 2025 Prefeitura Municipal de Cabo Frio — SEMEI</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-blue-600 transition-colors">
            Política de Privacidade
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors">
            Suporte Técnico
          </a>
        </div>
      </div>
    </footer>
  );
}
