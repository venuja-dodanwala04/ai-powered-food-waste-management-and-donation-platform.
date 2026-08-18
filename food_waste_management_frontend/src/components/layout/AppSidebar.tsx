import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BrainCircuit,
  Boxes,
  Receipt,
  Gift,
  HandHeart,
  BarChart3,
  AlertOctagon,
  Trash2,
  Bell,
  MapPin,
  History,
  Truck,
  User,
  LogOut,
  Building2,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { User as UserType } from '../../types';

interface AppSidebarProps {
  user: UserType | null;
  onLogout: () => void;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  user,
  onLogout,
  onCloseMobile,
}) => {
  const location = useLocation();
  const isBusiness = user?.role === 'BUSINESS';

  const businessNav = [
    { label: 'Dashboard', path: '/business/dashboard', icon: LayoutDashboard },
    { label: 'AI Forecast', path: '/business/forecast', icon: BrainCircuit },
    { label: 'Inventory', path: '/business/inventory', icon: Boxes },
    { label: 'Sales Tracker', path: '/business/sales', icon: Receipt },
    { label: 'Donation Hub', path: '/business/donations', icon: Gift },
    { label: 'Donation Requests', path: '/business/donation-requests', icon: HandHeart },
    { label: 'Nearby Charities', path: '/business/charity-map', icon: MapPin },
    { label: 'Reports & Analytics', path: '/business/reports', icon: BarChart3 },
    { label: 'Expiry Warning', path: '/business/expiry', icon: AlertOctagon },
    { label: 'Food Waste Tracking', path: '/business/waste', icon: Trash2 },
    { label: 'Notifications', path: '/business/notifications', icon: Bell },
  ];

  const charityNav = [
    { label: 'Dashboard', path: '/charity/dashboard', icon: LayoutDashboard },
    { label: 'Available Donations', path: '/charity/donations', icon: Gift },
    { label: 'Nearby Donors Map', path: '/charity/map', icon: MapPin },
    { label: 'Donation Requests', path: '/charity/requests', icon: HandHeart },
    { label: 'Collections', path: '/charity/collections', icon: Truck },
    { label: 'Collection History', path: '/charity/history', icon: History },
    { label: 'Notifications', path: '/charity/notifications', icon: Bell },
  ];

  const navItems = isBusiness ? businessNav : charityNav;

  return (
    <aside className="w-64 h-full bg-eco-gradient-sidebar flex flex-col justify-between border-r border-eco-border/40 select-none">
      {/* Top Header Logo */}
      <div className="p-6 pb-4 border-b border-eco-border/20">
        <Logo size="md" showTagline />
        <div className="mt-3 px-2.5 py-1 bg-eco-surface/70 border border-eco-border/50 rounded-lg flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-eco-green" />
          <span className="text-xs font-medium text-eco-muted truncate">
            {user?.name || 'Grand Colombo'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-eco-surface text-white border border-eco-green/40 shadow-glow-green'
                  : 'text-eco-muted hover:text-white hover:bg-eco-surface/40'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-eco-green' : 'text-eco-muted'
                }`}
              />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User Footer Profile */}
      <div className="p-4 border-t border-eco-border/30 bg-eco-surface/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-eco-green/15 text-eco-green border border-eco-green/30">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white truncate max-w-[110px]">
                {user?.name || 'Grand Colombo'}
              </span>
              <span className="text-[10px] text-eco-muted font-medium">
                {user?.branch || (isBusiness ? 'Manage Account' : 'NGO Partner')}
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 text-eco-muted hover:text-eco-danger rounded-xl hover:bg-eco-surface transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
