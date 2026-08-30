import { apiRequest } from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1';

export interface ReportSummary {
  rangeDays: number;
  totalSalesVolumeKg: number;
  totalPreparedKg: number;
  totalWasteKg: number;
  financialLossLKR: number;
  wasteReductionPercent: number;
  foodDonatedKg: number;
  estimatedFinancialSavingsLKR: number;
  co2SavedKg: number;
  mealsDonated: number;
  donationBeneficiaries: number;
}

export interface DashboardSummary {
  todaySalesKg: number;
  todayWasteKg: number;
  salesDeltaPercent: number;
  donatedTodayKg: number;
  activeCollections: number;
}

const RANGE_DAYS: Record<string, number> = {
  Today: 7,
  '7 Days': 7,
  '30 Days': 30,
  '3 Months': 90,
};

class ReportsService {
  async getSummaryMetrics(range = '30 Days'): Promise<ReportSummary> {
    const days = RANGE_DAYS[range] ?? 30;
    return apiRequest<ReportSummary>(`/reports/summary?rangeDays=${days}`);
  }

  async getDashboardMetrics(): Promise<DashboardSummary> {
    return apiRequest<DashboardSummary>('/reports/dashboard');
  }

  async exportCSVReport(): Promise<void> {
    const token = localStorage.getItem('ecokitchen_token');
    const response = await fetch(`${API_BASE_URL}/reports/export.csv`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error('Could not export the report.');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EcoKitchen_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const reportsService = new ReportsService();
