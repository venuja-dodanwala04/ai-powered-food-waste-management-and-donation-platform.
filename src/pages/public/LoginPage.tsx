import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BrainCircuit, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { authService } from '../../services/authService';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('manager@greenkites.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    try {
      const user = await authService.login(email, password);
      if (user.role === 'BUSINESS') {
        navigate('/business/dashboard');
      } else {
        navigate('/charity/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-eco-bg">
      <div className="eco-card max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden shadow-2xl border-eco-border">
        {/* LEFT COLUMN: Credentials Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6">
          <div>
            <Logo size="md" showTagline />

            <div className="mt-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
                Welcome Back
              </h2>
              <p className="text-sm text-eco-muted mt-1.5">
                Enter your credentials to access the EcoKitchen AI system.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              {error && (
                <div className="p-3 text-xs text-eco-danger bg-eco-dangerBg rounded-xl border border-eco-danger/30">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-eco-muted mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="manager@greenkites.com"
                  className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-eco-muted">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-eco-green hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-eco-muted">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-eco-green w-4 h-4 bg-eco-surface"
                  />
                  <span>Remember Me</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold text-sm rounded-xl transition-all shadow-glow-green flex items-center justify-center gap-2 mt-2"
              >
                Log In <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-eco-border/40 text-center text-xs text-eco-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-eco-green font-bold hover:underline">
              Register here
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Visual AI & Sustainability Graphic */}
        <div className="hidden lg:flex p-12 bg-eco-gradient-sidebar flex-col justify-between relative overflow-hidden border-l border-eco-border/40">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-eco-green/15 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="p-3.5 rounded-2xl bg-eco-green/15 border border-eco-green/30 text-eco-green w-fit">
              <BrainCircuit className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-eco-blue/10 border border-eco-blue/30 text-eco-blue text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> EcoKitchen AI Engine
            </div>

            <h3 className="text-3xl font-extrabold text-white font-outfit leading-snug">
              Connecting Surplus to Society
            </h3>

            <p className="text-sm text-eco-muted leading-relaxed">
              Using artificial intelligence to predict food demand, optimize preparation quantities, and eliminate landfill food waste across Sri Lanka.
            </p>
          </div>

          <div className="relative z-10 space-y-3 pt-8 border-t border-eco-border/40">
            <div className="flex items-center gap-3 text-xs text-white">
              <CheckCircle className="w-4 h-4 text-eco-green shrink-0" />
              <span>Real-time shelf life monitoring & expiry alerts</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white">
              <CheckCircle className="w-4 h-4 text-eco-green shrink-0" />
              <span>Automated surplus matching with certified NGOs</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white">
              <CheckCircle className="w-4 h-4 text-eco-green shrink-0" />
              <span>Financial loss & sustainability analytics in LKR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
