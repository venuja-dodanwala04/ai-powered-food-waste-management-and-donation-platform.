import React, { useState, useEffect } from 'react';
import { Truck, MapPin, CheckCircle2, Clock, Navigation } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { donationService } from '../../services/donationService';
import { DonationRequest } from '../../types';

export const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<DonationRequest[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCollections(
      donationService.getRequests().filter((r) => r.status === 'Accepted' || r.status === 'Collected')
    );
  }, []);

  const handleConfirmCollection = (id: string) => {
    donationService.updateRequestStatus(id, 'Collected');
    setCollections(
      donationService.getRequests().filter((r) => r.status === 'Accepted' || r.status === 'Collected')
    );
    setToastMessage('Food collection confirmed successfully! Impact metrics updated.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collection Management"
        subtitle="Manage active pickup routes and confirm completed surplus food collections."
      />

      {toastMessage && (
        <div className="p-4 bg-eco-green/15 border border-eco-green/40 text-eco-green rounded-2xl flex items-center gap-3 animate-fadeIn text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className={`eco-card p-6 flex flex-col justify-between space-y-4 border ${
              col.status === 'Accepted'
                ? 'border-eco-blue/50 bg-eco-surface/80 shadow-glow-blue'
                : 'border-eco-green/30 bg-eco-card/50'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-outfit">
                    {col.donorName || 'Grand Colombo'}
                  </h3>
                  <p className="text-xs text-eco-muted flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-eco-green" /> {col.pickupAddress || 'Galle Face Terrace, Colombo 03'}
                  </p>
                </div>
                <StatusBadge status={col.status} />
              </div>

              <div className="p-4 rounded-xl bg-eco-surface border border-eco-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-eco-muted">Food Item:</span>
                  <span className="font-bold text-white">{col.requestedFood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-eco-muted">Quantity:</span>
                  <span className="font-extrabold text-eco-green">
                    {col.requestedQuantity} {col.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-eco-muted">Pickup Window:</span>
                  <span className="font-semibold text-eco-purple flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {col.pickupTime}
                  </span>
                </div>
              </div>
            </div>

            {col.status === 'Accepted' && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleConfirmCollection(col.id)}
                  className="w-full py-2.5 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold text-xs rounded-xl shadow-glow-green flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm Collection
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
