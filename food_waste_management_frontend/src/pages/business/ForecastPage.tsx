import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, CloudRain, Sun, Calendar, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { forecastService } from '../../services/forecastService';
import { Prediction } from '../../types';

export const ForecastPage: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isRainy, setIsRainy] = useState(true);
  const [isHoliday, setIsHoliday] = useState(false);
  const [seasonalBoost, setSeasonalBoost] = useState(10); // percent

  useEffect(() => {
    setPredictions(forecastService.getPredictions());
  }, []);

  const metrics = forecastService.getAccuracyMetrics();

  // Apply External Modifiers dynamically
  const modifiedPredictions = predictions.map((pred) => {
    let modifier = 1.0;
    if (isRainy) modifier += 0.05; // Rainy weather +5% prep boost
    if (isHoliday) modifier += 0.15; // Holiday +15% boost
    modifier += seasonalBoost / 100;

    const newRec = Math.round(pred.predictedDemand * modifier * 10) / 10;
    return {
      ...pred,
      recommendedPreparation: newRec,
      recommendedPurchase: Math.max(0, Math.round((newRec - pred.currentStock) * 10) / 10),
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Food Demand Forecasting"
        subtitle="Utilizes sales history, weather, and day of the week to recommend tomorrow's preparation amounts."
      />

      {/* TOP SUMMARY ROW: Accuracy Gauge & External Modifiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GLOBAL ACCURACY GAUGE */}
        <div className="eco-card p-6 border-eco-blue/40 flex items-center justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-eco-blue/15 text-eco-blue text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Model Performance
            </div>
            <h3 className="text-xl font-extrabold text-white font-outfit">Forecast Accuracy</h3>
            <p className="text-xs text-eco-muted">{metrics.recommendationPoolState}</p>
            <div className="flex items-center gap-3 pt-2 text-xs font-medium text-eco-muted">
              <span>MAE: <strong className="text-white">{metrics.maeKg} kg</strong></span>
              <span>•</span>
              <span>F1-Score: <strong className="text-white">{metrics.f1Score}</strong></span>
            </div>
          </div>

          {/* CIRCULAR / DONUT VISUAL (94%) */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#2A2F54" strokeWidth="8" fill="transparent" />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#3B82F6"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 * (1 - metrics.accuracyPercent / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-extrabold text-white font-outfit">
                {metrics.accuracyPercent}%
              </span>
              <span className="text-[9px] text-eco-blue font-bold uppercase tracking-wider">
                High Precision
              </span>
            </div>
          </div>
        </div>

        {/* EXTERNAL MODIFIERS CONTROLS (2 Columns) */}
        <div className="lg:col-span-2 eco-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-eco-border/40">
            <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-eco-green" /> External Demand Modifiers
            </h3>
            <span className="text-xs text-eco-muted">Interactive AI parameter tuner</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Weather Modifier */}
            <div className="p-3.5 rounded-xl bg-eco-surface border border-eco-border space-y-2">
              <label className="text-xs font-semibold text-eco-muted block">Expected Weather</label>
              <button
                onClick={() => setIsRainy(!isRainy)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-between border transition-all ${
                  isRainy
                    ? 'bg-eco-blue/20 text-eco-blue border-eco-blue/50'
                    : 'bg-eco-card text-white border-eco-border'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {isRainy ? <CloudRain className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
                  {isRainy ? 'Rainy Weather' : 'Clear / Sunny'}
                </span>
                <span>{isRainy ? '+5% Prep' : 'Standard'}</span>
              </button>
            </div>

            {/* Holiday Modifier */}
            <div className="p-3.5 rounded-xl bg-eco-surface border border-eco-border space-y-2">
              <label className="text-xs font-semibold text-eco-muted block">Holiday / Festival</label>
              <button
                onClick={() => setIsHoliday(!isHoliday)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-between border transition-all ${
                  isHoliday
                    ? 'bg-eco-purple/20 text-eco-purple border-eco-purple/50'
                    : 'bg-eco-card text-white border-eco-border'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {isHoliday ? 'Holiday Active' : 'Normal Day'}
                </span>
                <span>{isHoliday ? '+15% Boost' : '0%'}</span>
              </button>
            </div>

            {/* Seasonal Event Boost Slider */}
            <div className="p-3.5 rounded-xl bg-eco-surface border border-eco-border space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-eco-muted">Seasonal Event Boost</span>
                <span className="text-eco-green">+{seasonalBoost}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={seasonalBoost}
                onChange={(e) => setSeasonalBoost(Number(e.target.value))}
                className="w-full accent-eco-green bg-eco-card h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TABLE: Tomorrow's Predicted Demand */}
      <div className="eco-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white font-outfit">Tomorrow's Predicted Demand</h2>
            <p className="text-xs text-eco-muted">AI preparation recommendations per item</p>
          </div>
          <span className="text-xs text-eco-green font-semibold bg-eco-green/10 border border-eco-green/30 px-3 py-1 rounded-full">
            Trained on 1,240 Sales History Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-eco-border text-xs text-eco-muted uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Food Item</th>
                <th className="py-3 px-4 font-semibold">Current Stock</th>
                <th className="py-3 px-4 font-semibold">Predicted Demand</th>
                <th className="py-3 px-4 font-semibold">Recommended Prep</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-eco-border/40 text-sm">
              {modifiedPredictions.map((pred) => (
                <tr key={pred.id} className="hover:bg-eco-surface/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{pred.foodName}</td>
                  <td className="py-3.5 px-4 text-eco-muted">
                    {pred.currentStock} {pred.unit}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-eco-blue">
                    {pred.predictedDemand} {pred.unit}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-eco-green">
                    {pred.recommendedPreparation} {pred.unit}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={pred.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI SMART PROCUREMENT RECOMMENDATIONS */}
      <div className="eco-card p-6 border-eco-green/30 bg-eco-surface/40 space-y-4">
        <h2 className="text-base font-bold text-white font-outfit flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-eco-green" /> AI Smart Procurement Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-eco-card border border-eco-border flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-eco-green shrink-0 mt-0.5" />
            <p className="text-xs text-white leading-relaxed">
              "Purchase <strong>10.0 kg Chicken</strong> to satisfy tomorrow's demand based on 2.0 kg current inventory."
            </p>
          </div>
          <div className="p-4 rounded-xl bg-eco-card border border-eco-border flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-eco-green shrink-0 mt-0.5" />
            <p className="text-xs text-white leading-relaxed">
              "Purchase <strong>5.0 kg Assorted Vegetables</strong> for mixed salad prep."
            </p>
          </div>
          <div className="p-4 rounded-xl bg-eco-card border border-eco-border flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-eco-blue shrink-0 mt-0.5" />
            <p className="text-xs text-white leading-relaxed">
              "<strong>Hold purchase on Rice.</strong> Current 15.0 kg stock covers 2 days."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
