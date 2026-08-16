import React from 'react';
import { Filter } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  options: FilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
  title?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  activeValue,
  onChange,
  title,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {title && (
        <span className="text-xs font-semibold text-eco-muted flex items-center gap-1.5 mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> {title}:
        </span>
      )}
      {options.map((opt) => {
        const isActive = activeValue === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-eco-green text-eco-bg font-semibold shadow-glow-green'
                : 'bg-eco-surface border border-eco-border text-eco-muted hover:text-white hover:border-eco-borderLight'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
