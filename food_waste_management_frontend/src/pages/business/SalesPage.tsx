import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Sparkles, Gift, AlertTriangle, Search, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/SearchInput';
import { salesService } from '../../services/salesService';
import { inventoryService } from '../../services/inventoryService';
import { SalesEntry, FoodItem } from '../../types';

export const SalesPage: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<FoodItem[]>([]);
  const [salesLogs, setSalesLogs] = useState<SalesEntry[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [prepQty, setPrepQty] = useState<number | ''>(20);
  const [soldQty, setSoldQty] = useState<number | ''>(18);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const refreshLogs = () => salesService.getSalesLogs().then(setSalesLogs).catch(console.error);

  useEffect(() => {
    inventoryService.getItems().then((items) => {
      setInventoryItems(items);
      if (items.length > 0) setSelectedFoodId(items[0].id);
    }).catch(console.error);
    refreshLogs();
  }, []);

  const selectedItem = inventoryItems.find((i) => i.id === selectedFoodId);

  // Automatic Calculation
  const prep = Number(prepQty) || 0;
  const sold = Number(soldQty) || 0;
  const potentialWaste = Math.max(0, prep - sold);

  const handleLogSales = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      await salesService.logSales({
        foodItemId: selectedItem.id,
        foodName: selectedItem.foodName,
        date: entryDate,
        quantityPrepared: prep,
        quantitySold: sold,
        wasteQuantity: potentialWaste,
        unit: selectedItem.unit,
      });
      await refreshLogs();
      setToastMessage(`Sales entry recorded successfully for ${selectedItem.foodName}.`);
    } catch {
      setToastMessage('Could not save the sales entry. Please try again.');
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredLogs = salesLogs.filter((log) =>
    log.foodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Sales Tracker"
        subtitle="Record items quantities prepared and sold to train the demand AI."
      />

      {toastMessage && (
        <div className="p-4 bg-eco-green/15 border border-eco-green/40 text-eco-green rounded-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 2-COLUMN GRID matching supplied Daily Sales Tracker UI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Record Today's Sales Form (5 Cols) */}
        <div className="lg:col-span-5 eco-card p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-eco-border/40">
            <div className="p-2.5 rounded-xl bg-eco-green/15 text-eco-green">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-outfit">Record Today's Sales</h2>
              <p className="text-xs text-eco-muted">Feed sales data into AI engine</p>
            </div>
          </div>

          <form onSubmit={handleLogSales} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Date of Entry
              </label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-green"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Food Item Selector
              </label>
              <select
                value={selectedFoodId}
                onChange={(e) => setSelectedFoodId(e.target.value)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-green"
              >
                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.foodName} ({item.quantity} {item.unit} in stock)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-eco-muted mb-1">
                  Quantity Prepared (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={prepQty}
                  onChange={(e) => setPrepQty(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-green"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-eco-muted mb-1">
                  Quantity Sold (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={soldQty}
                  onChange={(e) => setSoldQty(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-green"
                />
              </div>
            </div>

            {/* AUTOMATIC CALCULATION CARD */}
            <div className="p-4 rounded-xl bg-eco-surface border border-eco-border space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-eco-muted font-medium">Potential Food Waste Detected:</span>
                <span
                  className={`font-extrabold text-sm ${
                    potentialWaste > 0 ? 'text-eco-danger' : 'text-eco-green'
                  }`}
                >
                  {potentialWaste.toFixed(1)} kg
                </span>
              </div>

              {potentialWaste > 0 && (
                <div className="p-3 rounded-lg bg-eco-warning/10 border border-eco-warning/30 flex items-start gap-2.5 text-xs text-eco-warning">
                  <Gift className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Donation Recommendation</p>
                    <p className="text-[11px] mt-0.5 opacity-90">
                      Post {potentialWaste.toFixed(1)} kg to Nearby Charities before evening cutoff.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* AI FORECAST ADVICE */}
            <div className="p-4 rounded-xl bg-eco-blue/10 border border-eco-blue/30 space-y-1">
              <div className="flex items-center gap-1.5 text-eco-blue font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" /> AI Forecast Advice
              </div>
              <p className="text-xs text-white">
                "AI recommends preparing {(sold * 1.02).toFixed(1)} kg tomorrow to satisfy predicted demand without waste."
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold text-sm rounded-xl transition-all shadow-glow-green"
            >
              Log Sales Entry
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Previous Sales Log (7 Cols) */}
        <div className="lg:col-span-7 eco-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-outfit">Previous Sales Log</h2>
                <p className="text-xs text-eco-muted">Recent sales entries and waste calculation history</p>
              </div>
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search sales log..."
                className="w-full sm:w-48"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-eco-border text-xs text-eco-muted uppercase tracking-wider">
                    <th className="py-3 px-3 font-semibold">Date</th>
                    <th className="py-3 px-3 font-semibold">Item</th>
                    <th className="py-3 px-3 font-semibold">Prep / Sold</th>
                    <th className="py-3 px-3 font-semibold">Waste</th>
                    <th className="py-3 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-eco-border/40 text-xs">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-eco-surface/40 transition-colors">
                      <td className="py-3 px-3 text-eco-muted font-medium">{log.date}</td>
                      <td className="py-3 px-3 font-bold text-white">{log.foodName}</td>
                      <td className="py-3 px-3 text-white">
                        {log.quantityPrepared} / {log.quantitySold} {log.unit}
                      </td>
                      <td className="py-3 px-3 font-semibold text-eco-danger">
                        {log.wasteQuantity} {log.unit}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={log.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-eco-border/30 flex items-center justify-between text-xs text-eco-muted">
            <span>Showing {filteredLogs.length} entries</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
