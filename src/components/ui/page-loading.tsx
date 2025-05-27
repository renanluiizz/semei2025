
import { LoadingSpinner } from "./loading-spinner"

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500">Carregando...</p>
      </div>
    </div>
  )
}
