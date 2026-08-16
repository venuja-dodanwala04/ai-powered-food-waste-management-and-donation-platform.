import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="eco-card p-10 text-center flex flex-col items-center justify-center my-4">
      <div className="p-4 rounded-2xl bg-eco-surface border border-eco-border mb-4 text-eco-muted">
        <Icon className="w-10 h-10 text-eco-green" />
      </div>
      <h3 className="text-lg font-bold text-white font-outfit">{title}</h3>
      {description && <p className="text-sm text-eco-muted max-w-md mt-1.5">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-semibold rounded-xl text-sm transition-colors shadow-glow-green"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
