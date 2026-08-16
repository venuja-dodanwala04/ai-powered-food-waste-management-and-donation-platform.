import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-eco-danger hover:bg-red-600 text-white',
    warning: 'bg-eco-warning hover:bg-amber-600 text-eco-bg font-bold',
    info: 'bg-eco-blue hover:bg-blue-600 text-white',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="eco-card max-w-md w-full p-6 relative border-eco-border shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-eco-muted hover:text-white p-1 rounded-lg hover:bg-eco-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              variant === 'danger'
                ? 'bg-eco-danger/15 text-eco-danger'
                : variant === 'warning'
                ? 'bg-eco-warning/15 text-eco-warning'
                : 'bg-eco-blue/15 text-eco-blue'
            }`}
          >
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-outfit">{title}</h3>
            <p className="text-sm text-eco-muted mt-1.5">{description}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-eco-border/40">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-eco-surface hover:bg-eco-border border border-eco-border text-white text-sm font-medium rounded-xl transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${variantStyles[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
