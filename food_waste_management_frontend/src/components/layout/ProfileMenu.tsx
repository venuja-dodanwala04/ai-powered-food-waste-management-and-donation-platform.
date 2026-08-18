import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { User as UserType } from '../../types';

interface ProfileMenuProps {
  user: UserType | null;
  onLogout: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const isBusiness = user?.role === 'BUSINESS';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-3 rounded-full bg-eco-surface hover:bg-eco-card border border-eco-border text-white text-xs font-semibold transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-eco-green/20 text-eco-green flex items-center justify-center font-bold">
          {user?.name.charAt(0) || 'G'}
        </div>
        <span className="hidden sm:inline-block max-w-[100px] truncate">
          {user?.name || 'Grand Colombo'}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-eco-card border border-eco-border rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
            <div className="px-3 py-2 border-b border-eco-border/40">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-eco-muted truncate">{user?.email}</p>
            </div>

            <div className="py-1 space-y-0.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate(isBusiness ? '/business/profile' : '/charity/profile');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-eco-muted hover:text-white hover:bg-eco-surface rounded-xl transition-colors"
              >
                <User className="w-4 h-4 text-eco-green" /> Profile & Settings
              </button>

            </div>

            <div className="pt-1 border-t border-eco-border/40">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-eco-danger hover:bg-eco-danger/10 rounded-xl transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
