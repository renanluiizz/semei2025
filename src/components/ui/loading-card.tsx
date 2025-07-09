
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingCardProps {
  showTitle?: boolean;
  lines?: number;
  className?: string;
}

export function LoadingCard({ showTitle = false, lines = 3, className }: LoadingCardProps) {
  return (
    <Card className={`animate-pulse ${className || ''}`}>
      {showTitle && (
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
