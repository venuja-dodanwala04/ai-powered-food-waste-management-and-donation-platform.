import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Gift, HeartHandshake, CheckCircle2, Clock } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { donationService } from '../../services/donationService';
import { inventoryService } from '../../services/inventoryService';
import { Donation, FoodItem } from '../../types';

export const DonationsPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { prefillItem?: string; prefillQty?: number } | undefined;

  const [inventoryItems, setInventoryItems] = useState<FoodItem[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedFoodName, setSelectedFoodName] = useState(state?.prefillItem || 'Chicken Curry & Steamed Rice');
  const [quantity, setQuantity] = useState<number | ''>(state?.prefillQty || 15);
  const [unit, setUnit] = useState('kg');
  const [pickupTime, setPickupTime] = useState('19:00 - 20:00');
  const [pickupDate, setPickupDate] = useState('2026-07-19');
  const [pickupAddress, setPickupAddress] = useState('Grand Colombo Main Kitchen, Colombo 03');
  const [notes, setNotes] = useState('Freshly prepared evening batch. Refrigeration available upon request.');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    inventoryService.getItems().then(setInventoryItems).catch(console.error);
    setDonations(donationService.getDonations());
  }, []);

  const handlePostSurplus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFoodName) return;

    const newDonation = donationService.createDonation({
      donorId: 'usr_business_1',
      donorName: 'Grand Colombo',
      donorAddress: 'Galle Face Terrace, Colombo 03',
      donorPhone: '+94 11 234 5678',
      foodItemName: selectedFoodName,
      category: 'Prepared Food',
      quantity: Number(quantity) || 10,
      unit,
      pickupAddress,
      pickupTime,
      pickupDate,
      expiryTime: `${pickupDate} 22:00`,
      distanceKm: 2.4,
    });

    setDonations([newDonation, ...donations]);
    setToastMessage(`Surplus food posted successfully for donation! (${selectedFoodName})`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donation Management"
        subtitle="Post surplus food for nearby verified charities, NGOs, and food banks."
      />

      {toastMessage && (
        <div className="p-4 bg-eco-green/15 border border-eco-green/40 text-eco-green rounded-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 2-COLUMN GRID matching supplied Donation Management UI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: CREATE DONATION FORM (5 Cols) */}
        <div className="lg:col-span-5 eco-card p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-eco-border/40">
            <div className="p-2.5 rounded-xl bg-eco-purple/15 text-eco-purple">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-outfit">Post Surplus Food</h2>
              <p className="text-xs text-eco-muted">Broadcast to nearby verified charity partners</p>
            </div>
          </div>

          <form onSubmit={handlePostSurplus} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Food Item
              </label>
              <input
                type="text"
                value={selectedFoodName}
                onChange={(e) => setSelectedFoodName(e.target.value)}
                placeholder="e.g. Chicken Curry & Steamed Rice"
                required
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-purple"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-eco-muted mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-purple"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-eco-muted mb-1">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-purple"
                >
                  <option value="kg">kg</option>
                  <option value="packs">packs</option>
                  <option value="units">units</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-eco-muted mb-1">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-purple"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-eco-muted mb-1">
                  Pickup Window
                </label>
                <input
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="19:00 - 20:00"
                  className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-purple"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Pickup Address
              </label>
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Special Notes / Handling Instructions
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-purple"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-eco-purple hover:bg-purple-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-glow-purple flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" /> Post Surplus Food
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: DONATION HISTORY & STATUS TRACKER (7 Cols) */}
        <div className="lg:col-span-7 eco-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-outfit">
                  Donation History & Status Tracker
                </h2>
                <p className="text-xs text-eco-muted">Active surplus offers and collection logs</p>
              </div>
              <span className="text-xs text-eco-purple font-semibold bg-eco-purple/10 border border-eco-purple/30 px-3 py-1 rounded-full">
                {donations.length} Active Listings
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-eco-border text-xs text-eco-muted uppercase tracking-wider">
                    <th className="py-3 px-3 font-semibold">Food Item</th>
                    <th className="py-3 px-3 font-semibold">Quantity</th>
                    <th className="py-3 px-3 font-semibold">Pickup Time</th>
                    <th className="py-3 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-eco-border/40 text-xs">
                  {donations.map((don) => (
                    <tr key={don.id} className="hover:bg-eco-surface/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white">
                        <div>
                          <p className="text-white font-bold">{don.foodItemName}</p>
                          <p className="text-[10px] text-eco-muted">{don.pickupAddress}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-eco-green">
                        {don.quantity} {don.unit}
                      </td>
                      <td className="py-3.5 px-3 text-eco-muted font-medium flex items-center gap-1 mt-2">
                        <Clock className="w-3 h-3 text-eco-purple" /> {don.pickupTime}
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={don.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-eco-border/30 text-center">
            <span className="text-xs text-eco-muted">
              Charities are notified automatically upon posting.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
