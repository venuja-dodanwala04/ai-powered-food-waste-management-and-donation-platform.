import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  icon?: LucideIcon;
  iconBg?: string;
  accentColor?: 'green' | 'blue' | 'purple' | 'danger' | 'warning';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  trendDirection,
  subtitle,
  icon: Icon,
  accentColor = 'green',
}) => {
  const borderAccents = {
    green: 'border-l-4 border-l-eco-green',
    blue: 'border-l-4 border-l-eco-blue',
    purple: 'border-l-4 border-l-eco-purple',
    danger: 'border-l-4 border-l-eco-danger',
    warning: 'border-l-4 border-l-eco-warning',
  };

  const iconColors = {
    green: 'text-eco-green bg-eco-green/10',
    blue: 'text-eco-blue bg-eco-blue/10',
    purple: 'text-eco-purple bg-eco-purple/10',
    danger: 'text-eco-danger bg-eco-danger/10',
    warning: 'text-eco-warning bg-eco-warning/10',
  };

  return (
    <div className={`eco-card p-5 relative overflow-hidden ${borderAccents[accentColor]}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-eco-muted">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 font-outfit">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${iconColors[accentColor]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-3 pt-2 border-t border-eco-border/30 flex items-center justify-between text-xs">
          {trend && (
            <span
              className={`font-semibold ${
                trendDirection === 'down'
                  ? 'text-eco-danger'
                  : trendDirection === 'up'
                  ? 'text-eco-green'
                  : 'text-eco-muted'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-eco-muted">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
