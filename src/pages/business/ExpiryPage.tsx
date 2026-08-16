import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, Clock, Gift, Trash2, Calendar, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { inventoryService } from '../../services/inventoryService';
import { FoodItem } from '../../types';

export const ExpiryPage: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    inventoryService.getItems().then(setItems).catch(console.error);
  }, []);

  // Column 1: Critical Expiry Today (within 12 hours)
  const criticalItems = items.filter(
    (item) => item.status === 'Critical Expiry' || (item.expiryHoursLeft && item.expiryHoursLeft <= 12)
  );

  // Column 2: Warning - Tomorrow (13 to 48 hours)
  const warningItems = items.filter(
    (item) =>
      item.status === 'Expiring Soon' ||
      (item.expiryHoursLeft && item.expiryHoursLeft > 12 && item.expiryHoursLeft <= 48)
  );

  // Column 3: Scheduled - This Week (> 48 hours)
  const scheduledItems = items.filter(
    (item) => item.status === 'Fresh' || (item.expiryHoursLeft && item.expiryHoursLeft > 48)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expiry Warning Board"
        subtitle="Real-time schedule tracking stock shelf-life limits with immediate donation actions."
      />

      {/* 3 KANBAN COLUMNS matching supplied Expiry Warning Board UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1: CRITICAL EXPIRY TODAY (RED STYLING) */}
        <div className="eco-card p-5 border-eco-danger/50 bg-eco-dangerBg/5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-eco-danger/30">
              <div className="flex items-center gap-2 text-eco-danger font-extrabold text-sm uppercase tracking-wider">
                <AlertOctagon className="w-5 h-5" /> Critical Expiry Today
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-eco-danger/20 text-eco-danger text-xs font-bold">
                {criticalItems.length} items
              </span>
            </div>

            <div className="space-y-4">
              {criticalItems.map((item) => (
                <div
                  key={item.id}
                  className="eco-card p-4 border-eco-danger/40 bg-eco-surface/80 space-y-3 hover:border-eco-danger transition-colors shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.foodName}</h4>
                      <p className="text-xs text-eco-danger font-extrabold mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Expires in {item.expiryHoursLeft || 2} hours / {item.quantity} {item.unit}
                      </p>
                    </div>
                    <StatusBadge status="Critical Expiry" size="sm" />
                  </div>

                  {/* AI ADVICE BANNER */}
                  <div className="p-2.5 rounded-lg bg-eco-danger/10 border border-eco-danger/20 text-[11px] text-white">
                    <span className="text-eco-danger font-bold">AI Advice: </span>
                    Donate now. Feed approximately {Math.round(item.quantity * 2)} people.
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() =>
                        navigate('/business/donations', {
                          state: { prefillItem: item.foodName, prefillQty: item.quantity },
                        })
                      }
                      className="flex-1 py-1.5 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold text-xs rounded-lg transition-all shadow-glow-green flex items-center justify-center gap-1"
                    >
                      <Gift className="w-3.5 h-3.5" /> Donate Now
                    </button>
                    <button
                      onClick={() =>
                        navigate('/business/waste', {
                          state: { prefillItem: item.foodName, prefillQty: item.quantity },
                        })
                      }
                      className="px-3 py-1.5 bg-eco-surface hover:bg-eco-danger/20 border border-eco-danger/40 text-eco-danger text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Discard / Log
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: WARNING - TOMORROW (AMBER STYLING) */}
        <div className="eco-card p-5 border-eco-warning/50 bg-eco-warningBg/5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-eco-warning/30">
              <div className="flex items-center gap-2 text-eco-warning font-extrabold text-sm uppercase tracking-wider">
                <Clock className="w-5 h-5" /> Warning — Tomorrow
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-eco-warning/20 text-eco-warning text-xs font-bold">
                {warningItems.length} items
              </span>
            </div>

            <div className="space-y-4">
              {warningItems.map((item) => (
                <div
                  key={item.id}
                  className="eco-card p-4 border-eco-warning/40 bg-eco-surface/80 space-y-3 hover:border-eco-warning transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.foodName}</h4>
                      <p className="text-xs text-eco-warning font-bold mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Expires in {item.expiryHoursLeft || 28} hours / {item.quantity} {item.unit}
                      </p>
                    </div>
                    <StatusBadge status="Expiring Soon" size="sm" />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() =>
                        navigate('/business/donations', {
                          state: { prefillItem: item.foodName, prefillQty: item.quantity },
                        })
                      }
                      className="flex-1 py-1.5 bg-eco-warning hover:bg-amber-600 text-eco-bg font-extrabold text-xs rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      <Gift className="w-3.5 h-3.5" /> Pre-Donate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 3: SCHEDULED - THIS WEEK (NEUTRAL STYLING) */}
        <div className="eco-card p-5 border-eco-border bg-eco-surface/20 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-eco-border/40">
              <div className="flex items-center gap-2 text-eco-muted font-extrabold text-sm uppercase tracking-wider">
                <Calendar className="w-5 h-5 text-eco-green" /> Scheduled — This Week
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-eco-surface border border-eco-border text-eco-muted text-xs font-bold">
                {scheduledItems.length} items
              </span>
            </div>

            <div className="space-y-4">
              {scheduledItems.map((item) => (
                <div
                  key={item.id}
                  className="eco-card p-4 border-eco-border bg-eco-surface/60 space-y-2 hover:border-eco-borderLight transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.foodName}</h4>
                      <p className="text-xs text-eco-muted mt-0.5">
                        Expires: {item.expiryDate} / {item.quantity} {item.unit}
                      </p>
                    </div>
                    <StatusBadge status="Fresh" size="sm" />
                  </div>
                  <div className="pt-2 text-right">
                    <button
                      onClick={() => navigate('/business/inventory')}
                      className="text-xs font-semibold text-eco-green hover:underline flex items-center justify-end gap-1 ml-auto"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> View Stock Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
