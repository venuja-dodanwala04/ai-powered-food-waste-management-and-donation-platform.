import { SalesEntry } from '../types';
import { apiRequest } from './apiClient';

interface SalesApiItem {
  id: string;
  food_item_id?: string;
  food_name: string;
  date: string;
  quantity_prepared: number;
  quantity_sold: number;
  waste_quantity: number;
  unit: string;
  status?: SalesEntry['status'];
  sold_out?: boolean;
}

export interface DailySalesPoint {
  date: string;
  sold: number;
  prepared: number;
  waste: number;
}

const toEntry = (item: SalesApiItem): SalesEntry => ({
  id: item.id,
  foodItemId: item.food_item_id ?? '',
  foodName: item.food_name,
  date: item.date.slice(0, 10),
  quantityPrepared: item.quantity_prepared,
  quantitySold: item.quantity_sold,
  wasteQuantity: item.waste_quantity,
  unit: item.unit,
  status: item.status ?? (item.sold_out ? 'Sold Out' : 'Logged'),
});

class SalesService {
  async getSalesLogs(limit = 50): Promise<SalesEntry[]> {
    const res = await apiRequest<{ items: SalesApiItem[] }>(`/sales?limit=${limit}`);
    return res.items.map(toEntry);
  }

  async logSales(entry: Omit<SalesEntry, 'id' | 'status'>): Promise<SalesEntry> {
    const created = await apiRequest<SalesApiItem>('/sales', {
      method: 'POST',
      body: JSON.stringify({
        food_item_id: entry.foodItemId || undefined,
        food_name: entry.foodName,
        date: entry.date,
        quantity_prepared: entry.quantityPrepared,
        quantity_sold: entry.quantitySold,
        waste_quantity: entry.wasteQuantity,
        unit: entry.unit,
      }),
    });
    return toEntry(created);
  }

  async getWeeklySales(days = 35): Promise<DailySalesPoint[]> {
    return apiRequest<DailySalesPoint[]>(`/sales/analytics/weekly?days=${days}`);
  }
}

export const salesService = new SalesService();
