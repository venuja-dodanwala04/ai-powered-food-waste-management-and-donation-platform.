import React, { useState, useEffect } from 'react';
import { HandHeart, MapPin, Clock, Check, X, Building2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { donationService } from '../../services/donationService';
import { DonationRequest } from '../../types';

export const DonationRequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Accepted' | 'Rejected'>('Pending');
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refresh = () => donationService.getRequests().then(setRequests).catch(console.error);

  useEffect(() => {
    refresh();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'Accepted' | 'Rejected') => {
    try {
      const updated = await donationService.updateRequestStatus(id, newStatus);
      await refresh();
      setToastMessage(
        `Donation request from ${updated.charityName} has been ${newStatus.toLowerCase()}.`
      );
    } catch {
      setToastMessage('Could not update the request status.');
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredRequests = requests.filter((r) => r.status === activeTab);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donation Requests"
        subtitle="Review incoming surplus pickup requests submitted by verified charity organizations."
      />

      {toastMessage && (
        <div className="p-4 bg-eco-green/15 border border-eco-green/40 text-eco-green rounded-2xl flex items-center gap-3 animate-fadeIn">
          <Check className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TAB SELECTOR matching supplied UI */}
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

      {/* REQUEST CARDS GRID */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          title={`No ${activeTab.toLowerCase()} donation requests`}
          description={`There are currently no donation requests in the ${activeTab.toLowerCase()} queue.`}
          icon={HandHeart}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="eco-card p-6 flex flex-col justify-between space-y-4 hover:border-eco-green/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-eco-blue/15 text-eco-blue border border-eco-blue/30">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-outfit">
                        {req.charityName}
                      </h3>
                      <p className="text-xs text-eco-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-eco-green" /> {req.distanceKm} km away
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={req.status} size="sm" />
                </div>

                <div className="p-4 rounded-xl bg-eco-surface border border-eco-border space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-eco-muted">Requested Item:</span>
                    <span className="font-bold text-white">{req.requestedFood}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-eco-muted">Quantity:</span>
                    <span className="font-extrabold text-eco-green">
                      {req.requestedQuantity} {req.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-eco-muted">Requested Pickup:</span>
                    <span className="font-semibold text-eco-purple flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {req.pickupTime}
                    </span>
                  </div>
                </div>

                {req.notes && (
                  <p className="text-xs text-eco-muted italic bg-eco-card p-2.5 rounded-lg border border-eco-border/40">
                    "{req.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons for Pending */}
              {req.status === 'Pending' && (
                <div className="flex items-center gap-3 pt-3 border-t border-eco-border/40">
                  <button
                    onClick={() => handleUpdateStatus(req.id, 'Accepted')}
                    className="flex-1 py-2 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold text-xs rounded-xl transition-all shadow-glow-green flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Accept
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                    className="flex-1 py-2 bg-eco-surface hover:bg-eco-danger/20 border border-eco-danger/40 text-eco-danger font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
