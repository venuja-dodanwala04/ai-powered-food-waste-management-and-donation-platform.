import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, HeartHandshake } from 'lucide-react';
import { AppSidebar } from '../components/layout/AppSidebar';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { ProfileMenu } from '../components/layout/ProfileMenu';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';
import { User } from '../types';

export const CharityLayout: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'CHARITY') {
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
      {/* Desktop Sidebar */}
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
        <header className="h-16 border-b border-eco-border/40 bg-eco-surface/70 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-eco-muted hover:text-white rounded-xl bg-eco-surface border border-eco-border"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold text-eco-green bg-eco-green/10 border border-eco-green/30 px-3 py-1 rounded-full">
              <HeartHandshake className="w-4 h-4" />
              <span>Charity Partner Dashboard — Hope Food Bank</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/charity/notifications')}
              className="relative p-2 text-eco-muted hover:text-white rounded-xl bg-eco-surface border border-eco-border"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-eco-green text-eco-bg font-extrabold text-[10px] rounded-full flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>

            <ProfileMenu user={user} onLogout={handleLogout} />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
