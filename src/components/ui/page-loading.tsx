
import { LoadingSpinner } from "./loading-spinner"

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div className="space-y-2">
          <p className="text-foreground font-medium">Carregando Sistema SEMEI...</p>
          <p className="text-muted-foreground text-sm">Aguarde um momento</p>
        </div>
      </div>
    </div>
  )
}
