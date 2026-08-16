import React from 'react';
import { X } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { User } from '../../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div className="fixed inset-y-0 left-0 w-72 bg-eco-bg z-50 flex flex-col animate-slideRight">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-eco-muted hover:text-white rounded-lg bg-eco-surface border border-eco-border z-10"
        >
          <X className="w-5 h-5" />
        </button>
        <AppSidebar user={user} onLogout={onLogout} onCloseMobile={onClose} />
      </div>
    </div>
  );
};
