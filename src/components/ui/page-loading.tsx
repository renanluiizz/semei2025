
import { LoadingSpinner } from "./loading-spinner"

export function PageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full">
      <div className="text-center space-y-6 p-6">
        {/* Logo/Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg animate-pulse">
          <LoadingSpinner size="lg" className="border-white/30 border-t-white" />
        </div>
        
        {/* Text */}
        <div className="space-y-3">
          <h2 className="text-gray-900 font-bold text-2xl">Carregando SEMEI</h2>
          <p className="text-gray-600 text-sm max-w-sm mx-auto">
            Aguarde um momento enquanto preparamos o sistema para você
          </p>
        </div>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
