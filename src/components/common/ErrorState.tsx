import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load data',
  message = 'An unexpected error occurred while fetching information.',
  onRetry,
}) => {
  return (
    <div className="eco-card p-8 border-eco-danger/40 bg-eco-dangerBg/10 text-center flex flex-col items-center justify-center my-4">
      <div className="p-3.5 rounded-full bg-eco-danger/20 text-eco-danger mb-3">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white font-outfit">{title}</h3>
      <p className="text-sm text-eco-muted mt-1 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-eco-surface hover:bg-eco-border border border-eco-border text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
};
