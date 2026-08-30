import React, { useEffect, useState } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { forecastService } from '../../services/forecastService';

export const ForecastPage: React.FC = () => {
  const [notImplemented, setNotImplemented] = useState(true);

  useEffect(() => {
    forecastService
      .getForecast()
      .then((result) => setNotImplemented(result.notImplemented))
      .catch(() => setNotImplemented(true));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Food Demand Forecasting"
        subtitle="LSTM-based demand prediction, smart preparation and procurement recommendations."
      />

      <div className="eco-card p-10 flex flex-col items-center text-center gap-4 border-eco-blue/30">
        <div className="p-4 rounded-2xl bg-eco-blue/15 text-eco-blue border border-eco-blue/30">
          <BrainCircuit className="w-9 h-9" />
        </div>
        <h2 className="text-xl font-extrabold text-white font-outfit">AI forecasting is coming soon</h2>
        <p className="text-sm text-eco-muted max-w-xl">
          {notImplemented
            ? 'The demand model is not deployed yet. Sales, waste and inventory are already being recorded in an LSTM-ready format, so predictions, recommended preparation and smart procurement will light up here once the model ships.'
            : 'Forecast data is available — reload the page.'}
        </p>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-eco-blue bg-eco-blue/10 border border-eco-blue/30 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" /> Endpoint status: 501 Not Implemented
        </div>
      </div>
    </div>
  );
};
