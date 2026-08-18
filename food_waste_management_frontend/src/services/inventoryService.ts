import { FoodItem } from '../types';
import { apiRequest } from './apiClient';

type InventoryApiItem = {
  id: string; user_id: string; food_name: string; category: FoodItem['category']; quantity: number;
  unit: FoodItem['unit']; purchase_date: string; expiry_date: string; storage_location: FoodItem['storageLocation'];
  status: FoodItem['status']; unit_cost: number;
};

const dateOnly = (value: string) => value.slice(0, 10);
const toItem = (item: InventoryApiItem): FoodItem => ({
  id: item.id, userId: item.user_id, foodName: item.food_name, category: item.category,
  quantity: item.quantity, unit: item.unit, purchaseDate: dateOnly(item.purchase_date),
  expiryDate: dateOnly(item.expiry_date), storageLocation: item.storage_location,
  status: item.status, unitCost: item.unit_cost,
});

class InventoryService {
  async getItems(): Promise<FoodItem[]> {
    const response = await apiRequest<{ items: InventoryApiItem[] }>('/inventory');
    return response.items.map(toItem);
  }

  async addItem(item: Omit<FoodItem, 'id'>): Promise<FoodItem> {
    const created = await apiRequest<InventoryApiItem>('/inventory', {
      method: 'POST',
      body: JSON.stringify({
        food_name: item.foodName, category: item.category, quantity: item.quantity, unit: item.unit,
        purchase_date: item.purchaseDate, expiry_date: item.expiryDate,
        storage_location: item.storageLocation, unit_cost: item.unitCost,
      }),
    });
    return toItem(created);
  }

  async deleteItem(id: string): Promise<void> {
    await apiRequest<void>(`/inventory/${id}`, { method: 'DELETE' });
  }
}

export const inventoryService = new InventoryService();
