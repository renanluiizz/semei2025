
import { LoadingSpinner } from "./loading-spinner"

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
          <LoadingSpinner size="lg" className="border-white/30 border-t-white" />
        </div>
        <div className="space-y-2">
          <p className="text-foreground font-semibold text-xl">Carregando Sistema SEMEI</p>
          <p className="text-muted-foreground text-sm">Aguarde um momento enquanto preparamos tudo para você</p>
        </div>
      </div>
    </div>
  )
}
