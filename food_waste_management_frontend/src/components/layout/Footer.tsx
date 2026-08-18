import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Heart, Github, ShieldCheck, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-eco-border/40 bg-eco-sidebar/80 backdrop-blur-md pt-10 pb-8 text-xs text-eco-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-eco-border/30">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-3 md:col-span-1">
            <Logo size="md" showTagline />
            <p className="text-eco-muted text-xs leading-relaxed mt-2">
              An Intelligent Food Waste Management & Donation Platform using Artificial Intelligence to predict food demand and connect businesses with certified local charities.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-outfit">
              Platform Features
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="hover:text-eco-green transition-colors">
                  Business Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-eco-green transition-colors">
                  AI Demand Forecasting
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-eco-green transition-colors">
                  Inventory & Expiry Tracker
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-eco-green transition-colors">
                  Surplus Food Donations
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Project Info */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-outfit">
              Project Details
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-eco-green" />
                <span>Group White Builders (Group 29)</span>
              </li>
              <li className="flex items-center gap-1.5">

                <span></span>
              </li>
              <li>
                <span className="text-eco-muted"></span>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-outfit">
              Get Started
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className="px-4 py-2.5 bg-eco-surface border border-eco-border hover:border-eco-green rounded-xl text-center font-bold text-white hover:text-eco-green transition-all"
              >
                Sign In to Dashboard
              </Link>
              <Link
                to="/register"
                className="px-4 py-2.5 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold rounded-xl text-center transition-all shadow-glow-green"
              >
                Register Account
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="flex items-center gap-1">
            © 2026 EcoKitchen AI Platform. Developed with <Heart className="w-3.5 h-3.5 text-eco-danger fill-eco-danger" /> by Group White builders.
          </p>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="text-eco-border">•</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="text-eco-border">•</span>
            <span className="hover:text-white cursor-pointer">Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
