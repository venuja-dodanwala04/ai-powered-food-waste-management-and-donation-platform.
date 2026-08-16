import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'dashboard' | 'chart';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 3,
}) => {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-eco-surface rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-eco-surface rounded-2xl border border-eco-border" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-eco-surface rounded-2xl border border-eco-border" />
          <div className="h-72 bg-eco-surface rounded-2xl border border-eco-border" />
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="eco-card p-4 space-y-3 animate-pulse">
        <div className="h-10 bg-eco-surface rounded-xl" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-12 bg-eco-surface/50 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-44 bg-eco-surface rounded-2xl border border-eco-border" />
      ))}
    </div>
  );
};
