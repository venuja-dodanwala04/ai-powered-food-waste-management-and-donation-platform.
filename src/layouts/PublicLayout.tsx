import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Footer } from '../components/layout/Footer';

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-eco-bg flex flex-col selection:bg-eco-green selection:text-eco-bg">
      {/* Header Bar */}
      <header className="border-b border-eco-border/40 bg-eco-surface/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
          <Link to="/">
            <Logo size="md" showTagline />
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:text-eco-green transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4.5 py-2 text-xs sm:text-sm font-semibold bg-eco-green hover:bg-eco-greenHover text-eco-bg rounded-xl transition-all shadow-glow-green"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Main Public Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Reusable Footer Component */}
      <Footer />
    </div>
  );
};
