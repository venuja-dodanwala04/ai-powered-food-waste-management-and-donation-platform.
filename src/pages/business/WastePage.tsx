import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Trash2, DollarSign, AlertTriangle, PieChart as PieIcon, BarChart2, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { WasteReasonChart } from '../../components/charts/WasteReasonChart';
import { WeeklyLossChart } from '../../components/charts/WeeklyLossChart';
import { wasteService } from '../../services/wasteService';
import { inventoryService } from '../../services/inventoryService';
import { WasteEntry, WasteReason, FoodItem } from '../../types';

export const WastePage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { prefillItem?: string; prefillQty?: number } | undefined;

  const [inventoryItems, setInventoryItems] = useState<FoodItem[]>([]);
  const [wasteLogs, setWasteLogs] = useState<WasteEntry[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [discardQty, setDiscardQty] = useState<number | ''>(state?.prefillQty || 8.4);
  const [reason, setReason] = useState<WasteReason>('Spoilage / Expired');
  const [incidentDate, setIncidentDate] = useState('2026-07-19');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    inventoryService.getItems().then((items) => {
      setInventoryItems(items);
      if (items.length > 0) {
        const prefillItem = state?.prefillItem;
        const found = prefillItem ? items.find((item) => item.foodName.includes(prefillItem)) : undefined;
        setSelectedFoodId(found?.id ?? items[0].id);
      }
    }).catch(console.error);
    setWasteLogs(wasteService.getWasteLogs());
  }, [state]);

  const selectedItem = inventoryItems.find((i) => i.id === selectedFoodId);
  const qty = Number(discardQty) || 0;
  const estimatedLossLKR = selectedItem ? qty * selectedItem.unitCost : qty * 1000;

  const handleLogWaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const newLog = wasteService.logWaste({
      userId: 'usr_business_1',
      foodItemId: selectedItem.id,
      foodName: selectedItem.foodName,
      quantity: qty,
      unit: selectedItem.unit,
      reason,
      financialLoss: estimatedLossLKR,
    });

    setWasteLogs([newLog, ...wasteLogs]);
    setToastMessage(`Waste event logged: ${qty} kg ${selectedItem.foodName} (LKR ${estimatedLossLKR.toLocaleString()}).`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const reasonChartData = wasteService.getReasonsChartData();
  const weeklyLossData = wasteService.getWeeklyLossChartData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Food Waste Tracking"
        subtitle="Monitor discarded food volumes, record waste reasons, and analyze financial loss."
      />

      {toastMessage && (
        <div className="p-4 bg-eco-danger/15 border border-eco-danger/40 text-eco-danger rounded-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP CARDS matching supplied Food Waste Tracking UI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Food Wasted Today"
          value="8.4 kg"
          trend="12% vs Yesterday"
          trendDirection="down"
          subtitle="Spoilage & overprep"
          icon={Trash2}
          accentColor="danger"
        />
        <StatCard
          title="Financial Loss Today"
          value="LKR 8,400"
          trend="Based on unit cost valuation"
          trendDirection="neutral"
          subtitle="Calculated in Sri Lankan Rupees"
          icon={DollarSign}
          accentColor="warning"
        />
        <StatCard
          title="Primary Waste Reason"
          value="Spoilage (Expired)"
          trend="55.4% of total waste volume"
          trendDirection="neutral"
          subtitle="Critical shelf-life exceed"
          icon={AlertTriangle}
          accentColor="purple"
        />
      </div>

      {/* MAIN CONTENT GRID: Left Log Form, Right Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: LOG WASTE EVENT FORM (5 Cols) */}
        <div className="lg:col-span-5 eco-card p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-eco-border/40">
            <div className="p-2.5 rounded-xl bg-eco-danger/15 text-eco-danger">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-outfit">Log Waste Event</h2>
              <p className="text-xs text-eco-muted">Record discarded food and calculate financial loss</p>
            </div>
          </div>

          <form onSubmit={handleLogWaste} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Date of Incident
              </label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-danger"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Food / Ingredient
              </label>
              <select
                value={selectedFoodId}
                onChange={(e) => setSelectedFoodId(e.target.value)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-danger"
              >
                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.foodName} (LKR {item.unitCost} / {item.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Quantity Discarded (kg)
              </label>
              <input
                type="number"
                step="0.5"
                value={discardQty}
                onChange={(e) => setDiscardQty(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-danger"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-eco-muted mb-1">
                Primary Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as WasteReason)}
                className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-danger"
              >
                <option value="Spoilage / Expired">Spoilage / Expired</option>
                <option value="Overproduction">Overproduction</option>
                <option value="Preparation Waste">Preparation Waste</option>
                <option value="Quality Issue">Quality Issue</option>
                <option value="Storage Failure">Storage Failure</option>
                <option value="Damaged Product">Damaged Product</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* AUTOMATICALLY CALCULATED FINANCIAL LOSS CARD */}
            <div className="p-4 rounded-xl bg-eco-danger/10 border border-eco-danger/30 space-y-1">
              <span className="text-[11px] font-bold text-eco-danger uppercase tracking-wider">
                Estimated Financial Loss
              </span>
              <div className="text-2xl font-extrabold text-white font-outfit">
                LKR {estimatedLossLKR.toLocaleString()}
              </div>
              <p className="text-[11px] text-eco-muted">
                Auto-calculated based on item valuation rate.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-eco-danger hover:bg-red-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg"
            >
              Log Waste Event
            </button>
          </form>
        </div>

        {/* RIGHT SIDE CHARTS (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Chart 1: Waste Volume by Reason Monthly */}
          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-eco-danger" /> Waste Volume by Reason Monthly
              </h3>
              <span className="text-xs text-eco-muted">Categorized share</span>
            </div>
            <WasteReasonChart data={reasonChartData} />
          </div>

          {/* Chart 2: Weekly Loss Trend (LKR) */}
          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-eco-blue" /> Weekly Loss Trend (LKR)
              </h3>
              <span className="text-xs text-eco-muted">7-day financial impact</span>
            </div>
            <WeeklyLossChart data={weeklyLossData} />
          </div>
        </div>
      </div>
    </div>
  );
};
