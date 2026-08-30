import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Trash2,
  Gift,
  BrainCircuit,
  AlertTriangle,
  Receipt,
  Plus,
  BarChart2,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SalesForecastChart } from '../../components/charts/SalesForecastChart';
import { inventoryService } from '../../services/inventoryService';
import { salesService } from '../../services/salesService';
import { reportsService, DashboardSummary } from '../../services/reportsService';
import { FoodItem } from '../../types';

export const DashboardPage: React.FC = () => {
  const [criticalExpiries, setCriticalExpiries] = useState<FoodItem[]>([]);
  const [chartData, setChartData] = useState<Array<{ day: string; actualSales: number }>>([]);
  const [metrics, setMetrics] = useState<DashboardSummary | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inventoryService.getItems().then((items) => {
      setCriticalExpiries(items.filter((item) => item.status === 'Critical Expiry' || item.status === 'Expired'));
    }).catch(console.error);
    salesService.getWeeklySales(21)
      .then((rows) => setChartData(rows.map((r) => ({ day: r.date.slice(5), actualSales: r.sold }))))
      .catch(console.error);
    reportsService.getDashboardMetrics().then(setMetrics).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Operational Dashboard"
        subtitle="July 19, 2026 | Grand Colombo Branch"
        actions={
          <button
            onClick={() => navigate('/business/sales')}
            className="px-4 py-2 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold rounded-xl text-xs sm:text-sm transition-all shadow-glow-green flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" /> Record Today's Sales
          </button>
        }
      />

      {/* TOP STAT CARDS (Matching Supplied Operational Dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Today's Sales */}
        <StatCard
          title="Today's Sales"
          value={`${metrics ? metrics.todaySalesKg : 0} Kg`}
          trend={metrics ? `${metrics.salesDeltaPercent >= 0 ? '+' : ''}${metrics.salesDeltaPercent}% vs Yesterday` : '—'}
          trendDirection={metrics && metrics.salesDeltaPercent < 0 ? 'down' : 'up'}
          subtitle="Revenue & Volume target"
          icon={TrendingUp}
          accentColor="green"
        />

        {/* Stat 2: Food Waste */}
        <StatCard
          title="Food Waste"
          value={`${metrics ? metrics.todayWasteKg : 0} Kg`}
          trend="Spoilage & excess prep"
          trendDirection="neutral"
          subtitle="Logged today"
          icon={Trash2}
          accentColor="danger"
        />

        {/* Stat 3: Donation Summary */}
        <StatCard
          title="Donation Summary"
          value={`${metrics ? metrics.donatedTodayKg : 0} Kg`}
          trend={metrics ? `${metrics.activeCollections} active collections` : '—'}
          trendDirection="neutral"
          subtitle="Surplus rescued"
          icon={Gift}
          accentColor="purple"
        />

        {/* Stat 4: AI Forecast Accuracy */}
        <StatCard
          title="AI Forecast Accuracy"
          value="—"
          trend="Coming soon"
          trendDirection="neutral"
          subtitle="Model not deployed yet"
          icon={BrainCircuit}
          accentColor="blue"
        />
      </div>

      {/* MAIN CONTENT GRID: Chart Left, Expiry Alerts Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN CHART: Sales vs AI Demand Prediction (2 Columns) */}
        <div className="lg:col-span-2 eco-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-outfit">
                Daily Sales (last 3 weeks)
              </h2>
              <p className="text-xs text-eco-muted mt-0.5">
                Actual daily sales volume. AI demand prediction overlay coming soon.
              </p>
            </div>
            <button
              onClick={() => navigate('/business/forecast')}
              className="text-xs font-semibold text-eco-blue hover:underline flex items-center gap-1"
            >
              View Full AI Forecast <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <SalesForecastChart data={chartData} />
        </div>

        {/* CRITICAL EXPIRY ALERTS (1 Column) */}
        <div className="eco-card p-6 flex flex-col justify-between border-eco-danger/30">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-eco-border/40">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-eco-danger/15 text-eco-danger">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-outfit">
                    Critical Expiry Alerts
                  </h2>
                  <p className="text-xs text-eco-muted">Stock expiring within 8 hours</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/business/expiry')}
                className="text-xs font-semibold text-eco-danger hover:underline"
              >
                Warning Board
              </button>
            </div>

            <div className="space-y-3">
              {criticalExpiries.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-eco-surface border border-eco-border hover:border-eco-danger/50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate max-w-[140px]">
                        {item.foodName}
                      </span>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <p className="text-xs text-eco-danger font-semibold">
                      Expires {item.expiryDate} | {item.quantity} {item.unit}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate('/business/donations', {
                        state: { prefillItem: item.foodName, prefillQty: item.quantity },
                      })
                    }
                    className="px-3 py-1.5 bg-eco-green hover:bg-eco-greenHover text-eco-bg text-xs font-extrabold rounded-lg shadow-glow-green shrink-0"
                  >
                    Donate
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-eco-border/30 text-center">
            <span className="text-xs text-eco-muted">
              Auto-sync enabled for kitchen display unit.
            </span>
          </div>
        </div>
      </div>

      {/* QUICK OPERATIONAL TASKS */}
      <div className="eco-card p-6">
        <h2 className="text-base font-bold text-white font-outfit mb-4">
          Quick Operational Tasks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/business/sales')}
            className="p-4 rounded-2xl bg-eco-surface border border-eco-border hover:border-eco-green flex items-center gap-3 transition-all text-left group"
          >
            <div className="p-3 rounded-xl bg-eco-green/15 text-eco-green group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Record Daily Sales</p>
              <p className="text-[11px] text-eco-muted mt-0.5">Train AI model</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/business/forecast')}
            className="p-4 rounded-2xl bg-eco-surface border border-eco-border hover:border-eco-blue flex items-center gap-3 transition-all text-left group"
          >
            <div className="p-3 rounded-xl bg-eco-blue/15 text-eco-blue group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Check Tomorrow's Forecast</p>
              <p className="text-[11px] text-eco-muted mt-0.5">Prep recommendations</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/business/inventory')}
            className="p-4 rounded-2xl bg-eco-surface border border-eco-border hover:border-eco-purple flex items-center gap-3 transition-all text-left group"
          >
            <div className="p-3 rounded-xl bg-eco-purple/15 text-eco-purple group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Log New Ingredients</p>
              <p className="text-[11px] text-eco-muted mt-0.5">Add to stock pool</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/business/waste')}
            className="p-4 rounded-2xl bg-eco-surface border border-eco-border hover:border-eco-danger flex items-center gap-3 transition-all text-left group"
          >
            <div className="p-3 rounded-xl bg-eco-danger/15 text-eco-danger group-hover:scale-105 transition-transform">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Generate Waste Report</p>
              <p className="text-[11px] text-eco-muted mt-0.5">Calculate LKR loss</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
