
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingCardProps {
  title?: boolean;
  lines?: number;
}

export function LoadingCard({ title = false, lines = 3 }: LoadingCardProps) {
  return (
    <Card className="semei-card">
      {title && (
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
