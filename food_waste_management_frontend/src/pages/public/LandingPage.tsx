import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Boxes, HeartHandshake, ArrowRight, ShieldCheck, Sparkles, TrendingDown } from 'lucide-react';
import { Logo } from '../../components/common/Logo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-eco-bg text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 bg-eco-gradient-hero overflow-hidden">
        {/* Glow backdrop decorative elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-eco-green/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-eco-surface/80 border border-eco-green/40 text-eco-green text-xs font-semibold shadow-glow-green">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Food Sustainability Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-outfit leading-tight">
            Reduce Waste. Predict Demand.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-green via-eco-blue to-eco-purple">
              Save Communities.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-eco-muted max-w-2xl mx-auto leading-relaxed">
            EcoKitchen AI empowers food businesses and charity organizations to eliminate food waste through real-time demand forecasting, shelf-life analytics, and seamless surplus donation matching.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold rounded-2xl transition-all shadow-glow-green flex items-center justify-center gap-2 text-base"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-3.5 bg-eco-surface hover:bg-eco-card border border-eco-border text-white font-bold rounded-2xl transition-all text-base"
            >
              Log In to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* 3 Main Core Feature Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-outfit">
            Intelligent Food Waste Management System
          </h2>
          <p className="text-sm text-eco-muted mt-2">
            Seamlessly bridging commercial food production with humanitarian surplus distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Predict Demand */}
          <div className="eco-card p-8 hover:border-eco-blue/50 transition-all group relative overflow-hidden">
            <div className="p-4 rounded-2xl bg-eco-blue/10 text-eco-blue w-fit mb-6 border border-eco-blue/30 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-outfit mb-3">1. Predict Demand</h3>
            <p className="text-sm text-eco-muted leading-relaxed">
              Trained machine learning models analyze daily sales history, weather patterns, and event calendars to recommend optimal daily food preparation quantities.
            </p>
            <div className="mt-6 pt-4 border-t border-eco-border/40 flex items-center gap-2 text-xs font-semibold text-eco-blue">
              <TrendingDown className="w-4 h-4" /> Up to 94.8% AI accuracy
            </div>
          </div>

          {/* Card 2: Manage Inventory */}
          <div className="eco-card p-8 hover:border-eco-green/50 transition-all group relative overflow-hidden">
            <div className="p-4 rounded-2xl bg-eco-green/10 text-eco-green w-fit mb-6 border border-eco-green/30 group-hover:scale-110 transition-transform">
              <Boxes className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-outfit mb-3">2. Manage Inventory</h3>
            <p className="text-sm text-eco-muted leading-relaxed">
              Track ingredient stock, shelf-life limits, and storage conditions. Automated real-time alerts ensure expiring food is identified hours before spoilage.
            </p>
            <div className="mt-6 pt-4 border-t border-eco-border/40 flex items-center gap-2 text-xs font-semibold text-eco-green">
              <ShieldCheck className="w-4 h-4" /> Shelf-life warning engine
            </div>
          </div>

          {/* Card 3: Donate Surplus */}
          <div className="eco-card p-8 hover:border-eco-purple/50 transition-all group relative overflow-hidden">
            <div className="p-4 rounded-2xl bg-eco-purple/10 text-eco-purple w-fit mb-6 border border-eco-purple/30 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-outfit mb-3">3. Donate Surplus</h3>
            <p className="text-sm text-eco-muted leading-relaxed">
              Instantly broadcast surplus food to verified nearby food banks and charity NGOs for swift collection, preventing landfill disposal and feeding local communities.
            </p>
            <div className="mt-6 pt-4 border-t border-eco-border/40 flex items-center gap-2 text-xs font-semibold text-eco-purple">
              <HeartHandshake className="w-4 h-4" /> Instant charity matching
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
