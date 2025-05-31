
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingCardProps {
  title?: boolean;
  lines?: number;
  className?: string;
}

export function LoadingCard({ title = true, lines = 3, className = "" }: LoadingCardProps) {
  return (
    <Card className={`semei-card ${className}`}>
      <CardContent className="p-6">
        {title && (
          <div className="semei-skeleton h-6 w-1/3 mb-4" />
        )}
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <div 
              key={index}
              className={`semei-skeleton h-4 ${
                index === lines - 1 ? 'w-2/3' : 'w-full'
              }`} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
