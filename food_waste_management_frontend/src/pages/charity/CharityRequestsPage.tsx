import React, { useState, useEffect } from 'react';
import { HandHeart, MapPin, Clock, Building2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { donationService } from '../../services/donationService';
import { DonationRequest } from '../../types';

export const CharityRequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Accepted' | 'Rejected'>('Pending');
  const [requests, setRequests] = useState<DonationRequest[]>([]);

  useEffect(() => {
    donationService.getRequests().then(setRequests).catch(console.error);
  }, []);

  const filtered = requests.filter((r) => r.status === activeTab);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tracked Donation Requests"
        subtitle="Monitor the status of your submitted surplus food pickup requests."
      />

      <div className="flex items-center gap-3 border-b border-eco-border/40 pb-2">
        {(['Pending', 'Accepted', 'Rejected'] as const).map((tab) => {
          const count = requests.filter((r) => r.status === tab).length;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-eco-green text-eco-bg shadow-glow-green'
                  : 'bg-eco-surface border border-eco-border text-eco-muted hover:text-white'
              }`}
            >
              <span>{tab} Requests</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-eco-bg text-eco-green' : 'bg-eco-card text-white'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={`No ${activeTab.toLowerCase()} requests`}
          description={`You have no donation requests with status ${activeTab.toLowerCase()}.`}
          icon={HandHeart}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((req) => (
            <div key={req.id} className="eco-card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-eco-blue/15 text-eco-blue border border-eco-blue/30">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-outfit">
                      {req.donorName || 'Grand Colombo'}
                    </h3>
                    <p className="text-xs text-eco-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-eco-green" /> {req.distanceKm} km away
                    </p>
                  </div>
                </div>
                <StatusBadge status={req.status} size="sm" />
              </div>

              <div className="p-4 rounded-xl bg-eco-surface border border-eco-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-eco-muted">Requested Food:</span>
                  <span className="font-bold text-white">{req.requestedFood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-eco-muted">Quantity:</span>
                  <span className="font-extrabold text-eco-green">
                    {req.requestedQuantity} {req.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-eco-muted">Pickup Window:</span>
                  <span className="font-semibold text-eco-purple flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {req.pickupTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
