import React, { useState, useEffect } from 'react';
import { HeartHandshake, ShieldCheck, Mail, Phone, MapPin, Save, Clock } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { authService } from '../../services/authService';
import { User } from '../../types';

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [charityType, setCharityType] = useState('Food Bank');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const u = authService.getCurrentUser();
    if (u) {
      setUser(u);
      setName(u.name);
      setEmail(u.email);
      setPhone(u.phone);
      setAddress(u.address);
      setCharityType(u.charityType || 'Food Bank');
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Charity profile & pickup parameters updated successfully!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="NGO Profile & Settings"
        subtitle="Manage charity accreditation, accepted food categories, and operating hours."
      />

      {toastMessage && (
        <div className="p-4 bg-eco-green/15 border border-eco-green/40 text-eco-green rounded-2xl flex items-center gap-3 animate-fadeIn text-sm font-semibold">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="eco-card p-6 bg-eco-gradient-accent border-eco-blue/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-eco-blue/20 text-eco-blue border border-eco-blue/40 flex items-center justify-center font-extrabold text-2xl font-outfit shadow-glow-blue">
            {name.charAt(0) || 'H'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-outfit">{name}</h2>
              <StatusBadge status="VERIFIED" size="sm" />
            </div>
            <p className="text-xs text-eco-muted mt-0.5">{charityType} • Registered Charity Partner</p>
          </div>
        </div>

        <span className="text-xs font-semibold text-eco-blue bg-eco-blue/10 border border-eco-blue/30 px-3 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Verified Food Bank
        </span>
      </div>

      <div className="eco-card p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Organisation Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Charity Classification
              </label>
              <input
                type="text"
                value={charityType}
                onChange={(e) => setCharityType(e.target.value)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Contact Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3 text-eco-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-eco-surface border border-eco-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Hotline / Dispatch Phone
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 absolute left-3 text-eco-muted" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-eco-surface border border-eco-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-blue"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-eco-muted mb-1">
              Food Bank Depot Address
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 absolute left-3 text-eco-muted" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-blue"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-eco-border/40 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-eco-blue hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-glow-blue flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save NGO Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
