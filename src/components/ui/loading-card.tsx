
import { LoadingSpinner } from './loading-spinner';

export function LoadingCard() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LoadingSpinner size="lg" className="text-blue-600" />
          </div>
          <h3 className="text-blue-800 font-bold text-xl mb-2">Carregando Sistema</h3>
          <p className="text-blue-700 mb-4">Aguarde enquanto carregamos os dados...</p>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
