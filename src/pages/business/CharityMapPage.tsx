import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Gift, Navigation, Building2, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';

export const CharityMapPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCharityId, setSelectedCharityId] = useState('charity_1');
  const navigate = useNavigate();

  const charities = [
    {
      id: 'charity_1',
      name: 'Hope Food Bank',
      distanceKm: 2.4,
      address: '142 Marine Drive, Colombo 04',
      phone: '+94 11 987 6543',
      hours: '08:00 – 20:00 Daily',
      categories: ['Prepared Meals', 'Dry Rations', 'Fresh Produce'],
      capacity: '300 Meals / Day',
      lat: 6.8912,
      lng: 79.8552,
    },
    {
      id: 'charity_2',
      name: 'Community Care NGO',
      distanceKm: 1.4,
      address: '88 High Level Road, Nugegoda',
      phone: '+94 11 555 4321',
      hours: '09:00 – 19:00 Daily',
      categories: ['Prepared Meals', 'Bakery Items'],
      capacity: '150 Meals / Day',
      lat: 6.8722,
      lng: 79.8885,
    },
    {
      id: 'charity_3',
      name: 'Grace Children Shelter',
      distanceKm: 3.8,
      address: '24 Havelock Road, Colombo 05',
      phone: '+94 11 444 8899',
      hours: '08:00 – 21:00 Daily',
      categories: ['Prepared Food', 'Dairy', 'Fruits'],
      capacity: '80 Children Meals',
      lat: 6.8855,
      lng: 79.8644,
    },
  ];

  const filtered = charities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCharity = charities.find((c) => c.id === selectedCharityId) || charities[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nearby Charities & Food Banks"
        subtitle="Discover verified humanitarian organizations operating in your vicinity."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAP VISUAL AREA (7 Cols) */}
        <div className="lg:col-span-7 eco-card p-6 min-h-[450px] flex flex-col justify-between relative overflow-hidden bg-eco-gradient-sidebar border-eco-green/30">
          <div className="flex items-center justify-between z-10">
            <div className="px-3 py-1 bg-eco-surface/80 border border-eco-green/40 rounded-full text-eco-green text-xs font-semibold flex items-center gap-1.5 shadow-glow-green">
              <MapPin className="w-3.5 h-3.5" /> Interactive Sri Lanka Map View
            </div>
            <span className="text-xs text-eco-muted">Colombo District Radius (5.0 km)</span>
          </div>

          {/* MOCK MAP GRAPHIC INTERFACE */}
          <div className="my-6 relative h-72 w-full rounded-2xl bg-eco-surface/60 border border-eco-border overflow-hidden flex items-center justify-center">
            {/* Map Grid Pattern background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#3B82F6 1px, transparent 1px), radial-gradient(#16E875 1px, #05051F 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Donor Business Pin (Grand Colombo) */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer">
              <div className="px-2 py-0.5 bg-eco-green text-eco-bg text-[10px] font-extrabold rounded-md shadow-glow-green mb-1">
                Grand Colombo (You)
              </div>
              <div className="w-6 h-6 rounded-full bg-eco-green/30 border-2 border-eco-green text-eco-green flex items-center justify-center animate-ping absolute" />
              <div className="w-6 h-6 rounded-full bg-eco-green text-eco-bg flex items-center justify-center font-bold text-xs relative shadow-glow-green">
                <Building2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Charity Pins */}
            {charities.map((c, idx) => {
              const isSelected = c.id === selectedCharityId;
              const positions = [
                { top: '35%', left: '65%' },
                { top: '65%', left: '75%' },
                { top: '75%', left: '45%' },
              ];
              const pos = positions[idx];

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCharityId(c.id)}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer"
                >
                  <div
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md mb-1 transition-all ${
                      isSelected
                        ? 'bg-eco-blue text-white shadow-glow-blue scale-110'
                        : 'bg-eco-surface border border-eco-border text-white hover:border-eco-blue'
                    }`}
                  >
                    {c.name} ({c.distanceKm}km)
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                      isSelected
                        ? 'bg-eco-blue text-white ring-4 ring-eco-blue/30 scale-110'
                        : 'bg-eco-card text-eco-blue border border-eco-blue/50 hover:scale-105'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIVE MAP FOOTER DETAILS */}
          <div className="p-4 rounded-xl bg-eco-surface/80 border border-eco-border flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
            <div>
              <p className="text-xs font-bold text-white">{activeCharity.name}</p>
              <p className="text-[11px] text-eco-muted">{activeCharity.address}</p>
            </div>
            <button
              onClick={() =>
                navigate('/business/donations', {
                  state: { prefillItem: 'Surplus Food Offer' },
                })
              }
              className="px-4 py-2 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold text-xs rounded-xl shadow-glow-green flex items-center gap-1.5 shrink-0"
            >
              <Gift className="w-3.5 h-3.5" /> Direct Donation Offer
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: CHARITY CARDS LIST (5 Cols) */}
        <div className="lg:col-span-5 eco-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-eco-border/40">
            <h2 className="text-base font-bold text-white font-outfit">Nearby Organizations</h2>
            <span className="text-xs text-eco-muted">{filtered.length} Partners</span>
          </div>

          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search charity by name or area..."
          />

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {filtered.map((charity) => {
              const isSelected = charity.id === selectedCharityId;
              return (
                <div
                  key={charity.id}
                  onClick={() => setSelectedCharityId(charity.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-eco-surface border-eco-green/50 shadow-glow-green'
                      : 'bg-eco-card/60 border-eco-border hover:border-eco-borderLight'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{charity.name}</h4>
                      <p className="text-xs text-eco-green font-semibold mt-0.5 flex items-center gap-1">
                        <Navigation className="w-3 h-3" /> {charity.distanceKm} km away
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-eco-muted bg-eco-surface px-2 py-0.5 rounded-full border border-eco-border">
                      {charity.capacity}
                    </span>
                  </div>

                  <p className="text-xs text-eco-muted mt-2">{charity.address}</p>

                  <div className="mt-3 pt-2 border-t border-eco-border/30 flex flex-wrap gap-1.5">
                    {charity.categories.map((cat, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-eco-blue/10 text-eco-blue px-2 py-0.5 rounded-md border border-eco-blue/20"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-eco-muted pt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-eco-green" /> {charity.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-eco-purple" /> {charity.hours}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
