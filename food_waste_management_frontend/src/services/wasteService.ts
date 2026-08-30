import { WasteEntry } from '../types';
import { apiRequest } from './apiClient';

interface WasteApiItem {
  id: string;
  user_id?: string;
  food_item_id?: string;
  food_name: string;
  quantity: number;
  unit: string;
  reason: string;
  financial_loss: number;
  date?: string;
  created_at: string;
}

const REASON_COLORS: Record<string, string> = {
  'Spoilage / Expired': '#EF4444',
  Overproduction: '#F59E0B',
  'Preparation Waste': '#3B82F6',
  'Quality Issue': '#8B5CF6',
  'Storage Failure': '#22D3EE',
  'Damaged Product': '#EC4899',
  Other: '#94A3B8',
};

const toEntry = (item: WasteApiItem): WasteEntry => ({
  id: item.id,
  userId: item.user_id ?? '',
  foodItemId: item.food_item_id ?? '',
  foodName: item.food_name,
  quantity: item.quantity,
  unit: item.unit,
  reason: item.reason as WasteEntry['reason'],
  financialLoss: item.financial_loss,
  createdAt: item.date ?? item.created_at,
});

class WasteService {
  async getWasteLogs(limit = 50): Promise<WasteEntry[]> {
    const res = await apiRequest<{ items: WasteApiItem[] }>(`/waste?limit=${limit}`);
    return res.items.map(toEntry);
  }

  async logWaste(entry: Omit<WasteEntry, 'id' | 'createdAt'> & { date?: string }): Promise<WasteEntry> {
    const created = await apiRequest<WasteApiItem>('/waste', {
      method: 'POST',
      body: JSON.stringify({
        food_item_id: entry.foodItemId || undefined,
        food_name: entry.foodName,
        quantity: entry.quantity,
        unit: entry.unit,
        reason: entry.reason,
        financial_loss: entry.financialLoss,
        date: entry.date,
      }),
    });
    return toEntry(created);
  }

  async getReasonsChartData(): Promise<Array<{ name: string; value: number; color: string }>> {
    const rows = await apiRequest<Array<{ reason: string; quantity: number }>>('/waste/analytics/reasons');
    const total = rows.reduce((sum, r) => sum + r.quantity, 0) || 1;
    return rows.map((r) => ({
      name: r.reason,
      value: Math.round((r.quantity / total) * 1000) / 10,
      color: REASON_COLORS[r.reason] ?? '#94A3B8',
    }));
  }

  async getWeeklyLossChartData(): Promise<Array<{ day: string; loss: number }>> {
    const rows = await apiRequest<Array<{ week: string; financial_loss: number }>>('/waste/analytics/weekly-loss');
    return rows.map((r) => ({ day: r.week.replace(/^\d{4}-/, ''), loss: r.financial_loss }));
  }

  async getTopWastedItems(): Promise<Array<{ foodName: string; quantity: number; financialLoss: number; primaryReason: string }>> {
    const rows = await apiRequest<Array<{ food_name: string; quantity: number; financial_loss: number; primary_reason: string }>>('/waste/analytics/top-items');
    return rows.map((r) => ({ foodName: r.food_name, quantity: r.quantity, financialLoss: r.financial_loss, primaryReason: r.primary_reason }));
  }
}

export const wasteService = new WasteService();
