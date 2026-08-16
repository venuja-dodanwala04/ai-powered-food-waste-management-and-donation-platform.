import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  Leaf,
  HeartHandshake,
  TrendingDown,
  Users,
  Award,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { SalesForecastChart } from '../../components/charts/SalesForecastChart';
import { WasteReasonChart } from '../../components/charts/WasteReasonChart';
import { WeeklyLossChart } from '../../components/charts/WeeklyLossChart';
import { reportsService } from '../../services/reportsService';

export const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('30 Days');
  const metrics = reportsService.getSummaryMetrics(dateRange);

  const handleExport = () => {
    reportsService.exportCSVReport();
  };

  const salesVsForecastData = [
    { day: 'Week 1', actualSales: 1120, aiPredicted: 1100 },
    { day: 'Week 2', actualSales: 1250, aiPredicted: 1240 },
    { day: 'Week 3', actualSales: 1180, aiPredicted: 1195 },
    { day: 'Week 4', actualSales: 1300, aiPredicted: 1290 },
  ];

  const wasteReasonData = [
    { name: 'Spoilage (Expired)', value: 55.4, color: '#EF4444' },
    { name: 'Overproduction', value: 24.6, color: '#F59E0B' },
    { name: 'Preparation Waste', value: 12.0, color: '#3B82F6' },
    { name: 'Storage Failure', value: 8.0, color: '#8B5CF6' },
  ];

  const weeklyLossData = [
    { day: 'Mon', loss: 12400 },
    { day: 'Tue', loss: 9800 },
    { day: 'Wed', loss: 15200 },
    { day: 'Thu', loss: 11000 },
    { day: 'Fri', loss: 8400 },
    { day: 'Sat', loss: 14500 },
    { day: 'Sun', loss: 16800 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive insights on sales trends, waste volume, donation impact, and financial savings."
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-eco-surface border border-eco-border rounded-xl p-1 text-xs">
              {['Today', '7 Days', '30 Days', '3 Months'].map((range) => (
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
          value={`${metrics.totalWasteKg} kg`}
          trend={`-${metrics.wasteReductionPercent}% Waste Reduction`}
          trendDirection="up"
          subtitle="Landfill diversion"
          icon={TrendingDown}
          accentColor="danger"
        />
        <StatCard
          title="Food Donated"
          value={`${metrics.foodDonatedKg} kg`}
          trend={`${metrics.mealsDonated} Meals Provided`}
          trendDirection="up"
          subtitle="Community impact"
          icon={HeartHandshake}
          accentColor="purple"
        />
        <StatCard
          title="Financial Savings"
          value={`LKR ${metrics.estimatedFinancialSavingsLKR.toLocaleString()}`}
          trend="Prevented loss valuation"
          trendDirection="up"
          subtitle="Sri Lankan Rupees"
          icon={DollarSign}
          accentColor="green"
        />
        <StatCard
          title="Est. CO₂ Saved"
          value={`${metrics.co2SavedKg} kg`}
          trend={`${metrics.donationBeneficiaries} Beneficiaries`}
          trendDirection="up"
          subtitle="Environmental footprint"
          icon={Leaf}
          accentColor="blue"
        />
      </div>

      {/* ENVIRONMENTAL / SUSTAINABILITY IMPACT BANNER */}
      <div className="eco-card p-6 bg-eco-gradient-accent border-eco-green/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-eco-green/20 text-eco-green border border-eco-green/40 shadow-glow-green">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-outfit">
              Sustainability Milestone — Eco Champion Award
            </h3>
            <p className="text-xs text-eco-muted mt-0.5">
              Grand Colombo prevented <strong>1,050 kg CO₂ equivalent greenhouse gas emissions</strong> this month through AI demand matching.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-center border-t md:border-t-0 md:border-l border-eco-border/40 pt-4 md:pt-0 md:pl-6 shrink-0">
          <div>
            <span className="text-xl font-extrabold text-eco-green font-outfit">{metrics.mealsDonated}</span>
            <span className="block text-[10px] text-eco-muted uppercase font-semibold">Meals Donated</span>
          </div>
          <div>
            <span className="text-xl font-extrabold text-eco-blue font-outfit">{metrics.donationBeneficiaries}</span>
            <span className="block text-[10px] text-eco-muted uppercase font-semibold">Beneficiaries</span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN CHARTS MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Sales vs Forecast */}
        <div className="eco-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-eco-green" /> Weekly Sales vs AI Demand Forecast
            </h3>
            <span className="text-xs text-eco-muted">Monthly aggregation</span>
          </div>
          <SalesForecastChart data={salesVsForecastData} />
        </div>

        {/* Chart 2: Waste Volume by Reason */}
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

      {/* MOST WASTED FOOD ITEMS RANKED TABLE */}
      <div className="eco-card p-6">
        <h3 className="text-base font-bold text-white font-outfit mb-4">
          Most Wasted Food Items (Ranked)
        </h3>

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
              <tr className="hover:bg-eco-surface/40">
                <td className="py-3.5 px-4 font-extrabold text-eco-danger">#1</td>
                <td className="py-3.5 px-4 font-bold text-white">Chicken Curry (Prepared)</td>
                <td className="py-3.5 px-4 text-white">45.0 kg</td>
                <td className="py-3.5 px-4 font-semibold text-eco-danger">LKR 54,000</td>
                <td className="py-3.5 px-4 text-eco-muted">Overproduction</td>
              </tr>
              <tr className="hover:bg-eco-surface/40">
                <td className="py-3.5 px-4 font-extrabold text-eco-warning">#2</td>
                <td className="py-3.5 px-4 font-bold text-white">Penne Pasta (Cooked)</td>
                <td className="py-3.5 px-4 text-white">32.5 kg</td>
                <td className="py-3.5 px-4 font-semibold text-eco-danger">LKR 26,000</td>
                <td className="py-3.5 px-4 text-eco-muted">Spoilage (Expired)</td>
              </tr>
              <tr className="hover:bg-eco-surface/40">
                <td className="py-3.5 px-4 font-extrabold text-eco-blue">#3</td>
                <td className="py-3.5 px-4 font-bold text-white">Mixed Vegetable Salad</td>
                <td className="py-3.5 px-4 text-white">28.0 kg</td>
                <td className="py-3.5 px-4 font-semibold text-eco-danger">LKR 18,200</td>
                <td className="py-3.5 px-4 text-eco-muted">Preparation Waste</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
