import { Prediction } from '../types';
import { ApiError, apiRequest } from './apiClient';

export interface ForecastResult {
  notImplemented: boolean;
  predictions: Prediction[];
}

/**
 * AI demand forecasting is not implemented yet — the backend returns HTTP 501.
 * The UI uses `notImplemented` to show a "coming soon" panel instead of an error.
 */
class ForecastService {
  async getForecast(): Promise<ForecastResult> {
    try {
      const res = await apiRequest<{ items: Prediction[] }>('/forecasts');
      return { notImplemented: false, predictions: res.items ?? [] };
    } catch (error) {
      if (error instanceof ApiError && (error.status === 501 || error.status === 404)) {
        return { notImplemented: true, predictions: [] };
      }
      throw error;
    }
  }
}

export const forecastService = new ForecastService();
