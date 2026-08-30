import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, MapPin, Clock, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { donationService } from '../../services/donationService';
import { Donation } from '../../types';

export const AvailableDonationsPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const refresh = () =>
    donationService
      .getDonations()
      .then((all) => setDonations(all.filter((d) => d.status === 'Available')))
      .catch(console.error);

  useEffect(() => {
    refresh();
  }, []);

  const handleConfirmRequest = async () => {
    if (!selectedDonation) return;

    try {
      await donationService.requestDonation({
        donationId: selectedDonation.id,
        requestedQuantity: selectedDonation.quantity,
        unit: selectedDonation.unit,
        pickupTime: selectedDonation.pickupTime,
        notes: requestNotes || 'Pickup requested for community food bank distribution.',
      });
      setToastMessage(`Donation request submitted for ${selectedDonation.foodItemName}!`);
      await refresh();
    } catch {
      setToastMessage('Could not submit the donation request.');
    }
    setSelectedDonation(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filtered = donations.filter((d) => {
    const matchesSearch =
      d.foodItemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || d.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Available Surplus Food Listings"
        subtitle="Browse surplus food posted by local restaurants, hotels, bakeries, and supermarkets."
      />

      {toastMessage && (
        <div className="p-4 bg-eco-green/15 border border-eco-green/40 text-eco-green rounded-2xl flex items-center gap-3 animate-fadeIn text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="eco-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by food name or business donor..."
          className="w-full sm:w-80"
        />
        <FilterBar
          options={[
            { label: 'All Categories', value: 'ALL' },
            { label: 'Prepared Food', value: 'Prepared Food' },
            { label: 'Vegetables', value: 'Vegetables' },
            { label: 'Bakery', value: 'Bakery' },
          ]}
          activeValue={categoryFilter}
          onChange={setCategoryFilter}
        />
      </div>

      {/* DONATION CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((don) => (
          <div
            key={don.id}
            className="eco-card p-6 flex flex-col justify-between space-y-4 border-eco-green/30 hover:border-eco-green transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-outfit">
                    {don.foodItemName}
                  </h3>
                  <p className="text-xs text-eco-green font-semibold mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {don.donorName} ({don.distanceKm} km away)
                  </p>
                </div>
                <StatusBadge status={don.status} size="sm" />
              </div>

              <div className="p-4 rounded-xl bg-eco-surface border border-eco-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-eco-muted">Quantity Available:</span>
                  <span className="font-extrabold text-eco-green">
                    {don.quantity} {don.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-eco-muted">Pickup Window:</span>
                  <span className="font-semibold text-eco-purple flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {don.pickupTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-eco-muted">Pickup Address:</span>
                  <span className="text-white truncate max-w-[150px]">{don.pickupAddress}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedDonation(don)}
              className="w-full py-2.5 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold text-xs rounded-xl shadow-glow-green flex items-center justify-center gap-1.5"
            >
              <HeartHandshake className="w-4 h-4" /> Request Donation
            </button>
          </div>
        ))}
      </div>

      {/* REQUEST MODAL */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="eco-card max-w-md w-full p-6 space-y-4 border-eco-green/40 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
              <Gift className="w-5 h-5 text-eco-green" /> Submit Donation Request
            </h3>

            <div className="p-4 rounded-xl bg-eco-surface border border-eco-border space-y-2 text-xs">
              <p className="font-bold text-white text-sm">{selectedDonation.foodItemName}</p>
              <p className="text-eco-green">Donor: {selectedDonation.donorName}</p>
              <p className="text-eco-muted">
                Quantity: {selectedDonation.quantity} {selectedDonation.unit}
              </p>
              <p className="text-eco-purple">Pickup Window: {selectedDonation.pickupTime}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Message to Donor / Transport Notes
              </label>
              <textarea
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                placeholder="e.g. Requesting collection using refrigerated van for evening food bank distribution."
                rows={3}
                className="w-full bg-eco-surface border border-eco-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-eco-green"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-eco-border/40">
              <button
                onClick={() => setSelectedDonation(null)}
                className="px-4 py-2 bg-eco-surface text-white text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRequest}
                className="px-5 py-2 bg-eco-green hover:bg-eco-greenHover text-eco-bg text-xs font-extrabold rounded-xl shadow-glow-green"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
