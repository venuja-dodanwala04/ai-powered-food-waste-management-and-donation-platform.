import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, HeartHandshake, ArrowRight } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { FileUploader } from '../../components/common/FileUploader';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>('BUSINESS');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [classification, setClassification] = useState('Restaurant');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await authService.register({
        name,
        email,
        password,
        phone: phone || '+94 77 000 0000',
        address: address || 'Sri Lanka',
        role,
        organizationName: name,
      });
      navigate(role === 'BUSINESS' ? '/business/dashboard' : '/charity/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create the account.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-eco-bg">
      <div className="eco-card max-w-3xl w-full p-6 sm:p-10 shadow-2xl border-eco-border">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="flex justify-center">
            <Logo size="md" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
            Create Your Account
          </h2>
          <p className="text-sm text-eco-muted">
            Choose your role to load the correct registration details.
          </p>
        </div>

        {/* Dynamic Role Selector */}
        <div className="grid grid-cols-2 gap-4 my-8 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setRole('BUSINESS')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              role === 'BUSINESS'
                ? 'bg-eco-green/15 border-eco-green text-eco-green shadow-glow-green'
                : 'bg-eco-surface border-eco-border text-eco-muted hover:text-white'
            }`}
          >
            <Building2 className="w-6 h-6" />
            <span className="text-xs font-bold">Food Business</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('CHARITY')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              role === 'CHARITY'
                ? 'bg-eco-blue/15 border-eco-blue text-eco-blue shadow-glow-blue'
                : 'bg-eco-surface border-eco-border text-eco-muted hover:text-white'
            }`}
          >
            <HeartHandshake className="w-6 h-6" />
            <span className="text-xs font-bold">Charity / NGO</span>
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-eco-danger bg-eco-dangerBg rounded-xl border border-eco-danger/30">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1.5">
                {role === 'BUSINESS' ? 'Organisation / Business Name' : 'Organisation Name'} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={role === 'BUSINESS' ? 'e.g. Grand Colombo' : 'e.g. Hope Food Bank'}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="contact@organisation.com"
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1.5">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1.5">
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1.5">
                {role === 'BUSINESS' ? 'Business Classification' : 'Charity / NGO Type'}
              </label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-all"
              >
                {role === 'BUSINESS' ? (
                  <>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Supermarket">Supermarket</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Catering">Catering</option>
                  </>
                ) : (
                  <>
                    <option value="Food Bank">Food Bank</option>
                    <option value="Community NGO">Community NGO</option>
                    <option value="Charity Shelter">Charity Shelter</option>
                    <option value="Religious Charity">Religious Charity</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1.5">
                Contact Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+94 11 234 5678"
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-eco-muted mb-1.5">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Galle Face Terrace, Colombo 03, Sri Lanka"
              className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-all"
            />
          </div>

          {/* Verification Document Drag & Drop File Uploader */}
          <div className="pt-2">
            <FileUploader
              label={
                role === 'BUSINESS'
                  ? 'Business License / Registration Certificate'
                  : 'NGO Registration Certificate'
              }
              onFileSelect={(file) => setUploadedFile(file)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold text-sm rounded-xl transition-all shadow-glow-green flex items-center justify-center gap-2 mt-4"
          >
            Complete Registration <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-eco-border/40 text-center text-xs text-eco-muted">
          Already registered?{' '}
          <Link to="/login" className="text-eco-green font-bold hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};
