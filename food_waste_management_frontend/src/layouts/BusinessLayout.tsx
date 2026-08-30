import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, Calendar, Building2 } from 'lucide-react';
import { AppSidebar } from '../components/layout/AppSidebar';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { ProfileMenu } from '../components/layout/ProfileMenu';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';
import { User } from '../types';

export const BusinessLayout: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'BUSINESS') {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    notificationService.getUnreadCount().then(setUnreadNotifs).catch(() => setUnreadNotifs(0));
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-eco-bg flex overflow-hidden">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        <AppSidebar user={user} onLogout={handleLogout} />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Operational Navigation Bar */}
        <header className="h-16 border-b border-eco-border/40 bg-eco-surface/70 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-eco-muted hover:text-white rounded-xl bg-eco-surface border border-eco-border"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-eco-muted">
              <Calendar className="w-4 h-4 text-eco-green" />
              <span>July 19, 2026</span>
              <span className="text-eco-border">•</span>
              <Building2 className="w-4 h-4 text-eco-blue" />
              <span>Grand Colombo Branch</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button
              onClick={() => navigate('/business/notifications')}
              className="relative p-2 text-eco-muted hover:text-white rounded-xl bg-eco-surface border border-eco-border hover:border-eco-borderLight transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-eco-green text-eco-bg font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <ProfileMenu user={user} onLogout={handleLogout} />
          </div>
        </header>

        {/* Dynamic Route Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
