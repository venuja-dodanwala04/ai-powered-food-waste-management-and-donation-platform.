import { Prediction } from '../types';
import { MOCK_FORECAST, MOCK_FORECAST_CHART_DATA } from '../data/mockForecast';

class ForecastService {
  private predictions: Prediction[] = [...MOCK_FORECAST];

  getPredictions(): Prediction[] {
    return [...this.predictions];
  }

  getChartData() {
    return MOCK_FORECAST_CHART_DATA;
  }

  getAccuracyMetrics() {
    return {
      accuracyPercent: 94.8,
      maeKg: 1.2,
      f1Score: 0.96,
      precisionLabel: 'High Precision',
      recommendationPoolState: 'Stable recommendation pool',
    };
  }
}

export const forecastService = new ForecastService();
