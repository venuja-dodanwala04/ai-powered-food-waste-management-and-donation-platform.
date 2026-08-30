import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Download,
  DollarSign,
  Leaf,
  HeartHandshake,
  TrendingDown,
  Award,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { WasteReasonChart } from '../../components/charts/WasteReasonChart';
import { WeeklyLossChart } from '../../components/charts/WeeklyLossChart';
import { reportsService, ReportSummary } from '../../services/reportsService';
import { wasteService } from '../../services/wasteService';

export const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('30 Days');
  const [metrics, setMetrics] = useState<ReportSummary | null>(null);
  const [wasteReasonData, setWasteReasonData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [weeklyLossData, setWeeklyLossData] = useState<Array<{ day: string; loss: number }>>([]);
  const [topItems, setTopItems] = useState<Array<{ foodName: string; quantity: number; financialLoss: number; primaryReason: string }>>([]);

  useEffect(() => {
    reportsService.getSummaryMetrics(dateRange).then(setMetrics).catch(console.error);
  }, [dateRange]);

  useEffect(() => {
    wasteService.getReasonsChartData().then(setWasteReasonData).catch(console.error);
    wasteService.getWeeklyLossChartData().then(setWeeklyLossData).catch(console.error);
    wasteService.getTopWastedItems().then(setTopItems).catch(console.error);
  }, []);

  const handleExport = () => {
    reportsService.exportCSVReport().catch(console.error);
  };

  const m = metrics;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive insights on sales trends, waste volume, donation impact, and financial savings."
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-eco-surface border border-eco-border rounded-xl p-1 text-xs">
              {['7 Days', '30 Days', '3 Months'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    dateRange === range
                      ? 'bg-eco-green text-eco-bg shadow-glow-green'
                      : 'text-eco-muted hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-eco-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-glow-blue flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Report (CSV)
            </button>
          </div>
        }
      />

      {/* SUMMARY STATISTICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Food Wasted"
          value={`${m ? m.totalWasteKg : 0} kg`}
          trend={m ? `${m.wasteReductionPercent >= 0 ? '-' : '+'}${Math.abs(m.wasteReductionPercent)}% vs previous period` : '—'}
          trendDirection={m && m.wasteReductionPercent >= 0 ? 'up' : 'down'}
          subtitle="Landfill diversion"
          icon={TrendingDown}
          accentColor="danger"
        />
        <StatCard
          title="Food Donated"
          value={`${m ? m.foodDonatedKg : 0} kg`}
          trend={m ? `${m.mealsDonated} meals provided` : '—'}
          trendDirection="up"
          subtitle="Community impact"
          icon={HeartHandshake}
          accentColor="purple"
        />
        <StatCard
          title="Financial Savings"
          value={`LKR ${(m ? m.estimatedFinancialSavingsLKR : 0).toLocaleString()}`}
          trend="Prevented loss valuation"
          trendDirection="up"
          subtitle="Sri Lankan Rupees"
          icon={DollarSign}
          accentColor="green"
        />
        <StatCard
          title="Est. CO₂ Saved"
          value={`${m ? m.co2SavedKg : 0} kg`}
          trend={m ? `${m.donationBeneficiaries} beneficiaries` : '—'}
          trendDirection="up"
          subtitle="Environmental footprint"
          icon={Leaf}
          accentColor="blue"
        />
      </div>

      {/* SUSTAINABILITY BANNER */}
      <div className="eco-card p-6 bg-eco-gradient-accent border-eco-green/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-eco-green/20 text-eco-green border border-eco-green/40 shadow-glow-green">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-outfit">Sustainability Impact</h3>
            <p className="text-xs text-eco-muted mt-0.5">
              Rescued <strong>{m ? m.foodDonatedKg : 0} kg</strong> of surplus food, avoiding an estimated{' '}
              <strong>{m ? m.co2SavedKg : 0} kg CO₂e</strong> over the selected period.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-center border-t md:border-t-0 md:border-l border-eco-border/40 pt-4 md:pt-0 md:pl-6 shrink-0">
          <div>
            <span className="text-xl font-extrabold text-eco-green font-outfit">{m ? m.mealsDonated : 0}</span>
            <span className="block text-[10px] text-eco-muted uppercase font-semibold">Meals Donated</span>
          </div>
          <div>
            <span className="text-xl font-extrabold text-eco-blue font-outfit">{m ? m.totalSalesVolumeKg.toLocaleString() : 0}</span>
            <span className="block text-[10px] text-eco-muted uppercase font-semibold">kg Sold</span>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="eco-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-eco-blue" /> Weekly Financial Loss (LKR)
            </h3>
            <span className="text-xs text-eco-muted">Last 7 weeks</span>
          </div>
          <WeeklyLossChart data={weeklyLossData} />
        </div>

        <div className="eco-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-eco-danger" /> Waste Reason Distribution
            </h3>
            <span className="text-xs text-eco-muted">Percentage breakdown</span>
          </div>
          <WasteReasonChart data={wasteReasonData} />
        </div>
      </div>

      {/* MOST WASTED FOOD ITEMS */}
      <div className="eco-card p-6">
        <h3 className="text-base font-bold text-white font-outfit mb-4">Most Wasted Food Items (Ranked)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-eco-border text-xs text-eco-muted uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Rank</th>
                <th className="py-3 px-4 font-semibold">Food Item</th>
                <th className="py-3 px-4 font-semibold">Volume Wasted</th>
                <th className="py-3 px-4 font-semibold">Financial Loss</th>
                <th className="py-3 px-4 font-semibold">Primary Cause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-eco-border/40 text-xs">
              {topItems.map((row, index) => (
                <tr key={row.foodName} className="hover:bg-eco-surface/40">
                  <td className="py-3.5 px-4 font-extrabold text-eco-danger">#{index + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{row.foodName}</td>
                  <td className="py-3.5 px-4 text-white">{row.quantity} kg</td>
                  <td className="py-3.5 px-4 font-semibold text-eco-danger">LKR {row.financialLoss.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-eco-muted">{row.primaryReason}</td>
                </tr>
              ))}
              {topItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-eco-muted">No waste recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
