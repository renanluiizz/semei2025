
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingCardProps {
  title?: boolean;
  lines?: number;
  className?: string;
}

export function LoadingCard({ title = true, lines = 3, className = "" }: LoadingCardProps) {
  return (
    <div className="semei-page-header">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
          <div className="h-6 bg-gray-200 rounded-full w-32"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="semei-card-stat animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <div className="semei-card animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="semei-card animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
