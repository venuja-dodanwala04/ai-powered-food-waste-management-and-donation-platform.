import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-eco-border/40">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-outfit">
          {title}
        </h1>
        {subtitle && (
          <p className="text-eco-muted text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};
