import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, Mail, Phone, MapPin, Key, Save } from 'lucide-react';
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
  const [branch, setBranch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const u = authService.getCurrentUser();
    if (u) {
      setUser(u);
      setName(u.name);
      setEmail(u.email);
      setPhone(u.phone);
      setAddress(u.address);
      setBranch(u.branch || 'Main Branch');
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Profile and operational settings updated successfully!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Business Profile & Settings"
        subtitle="Manage organisation details, branch locations, and security settings."
      />

      {toastMessage && (
        <div className="p-4 bg-eco-green/15 border border-eco-green/40 text-eco-green rounded-2xl flex items-center gap-3 animate-fadeIn text-sm font-semibold">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP USER CARD */}
      <div className="eco-card p-6 bg-eco-gradient-accent border-eco-green/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-eco-green/20 text-eco-green border border-eco-green/40 flex items-center justify-center font-extrabold text-2xl font-outfit shadow-glow-green">
            {name.charAt(0) || 'G'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-outfit">{name}</h2>
              <StatusBadge status="VERIFIED" size="sm" />
            </div>
            <p className="text-xs text-eco-muted mt-0.5">{branch} • Food Business Partner</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-eco-green bg-eco-green/10 border border-eco-green/30 px-3 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Eco-Certified Business
          </span>
        </div>
      </div>

      {/* EDIT FORM */}
      <div className="eco-card p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Business Name
              </label>
              <div className="relative flex items-center">
                <Building2 className="w-4 h-4 absolute left-3 text-eco-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-eco-surface border border-eco-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Branch / Outlet
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3 text-eco-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-eco-surface border border-eco-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Contact Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 absolute left-3 text-eco-muted" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-eco-surface border border-eco-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-eco-muted mb-1">
              Primary Kitchen / Pickup Address
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 absolute left-3 text-eco-muted" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-green"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-eco-border/40 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-glow-green flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
