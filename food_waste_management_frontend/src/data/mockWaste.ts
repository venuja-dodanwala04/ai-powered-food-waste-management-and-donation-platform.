import { WasteEntry } from '../types';

export const MOCK_WASTE_ENTRIES: WasteEntry[] = [
  {
    id: 'waste_1',
    userId: 'usr_business_1',
    foodItemId: 'food_1',
    foodName: 'Chicken Curry (Prepared)',
    quantity: 3.5,
    unit: 'kg',
    reason: 'Spoilage / Expired',
    financialLoss: 4200, // 3.5 * 1200
    createdAt: '2026-07-19T11:00:00Z',
  },
  {
    id: 'waste_2',
    userId: 'usr_business_1',
    foodItemId: 'food_5',
    foodName: 'Penne Pasta (Cooked)',
    quantity: 3.0,
    unit: 'kg',
    reason: 'Overproduction',
    financialLoss: 2400, // 3.0 * 800
    createdAt: '2026-07-19T10:15:00Z',
  },
  {
    id: 'waste_3',
    userId: 'usr_business_1',
    foodItemId: 'food_2',
    foodName: 'Mixed Vegetable Salad',
    quantity: 1.9,
    unit: 'kg',
    reason: 'Preparation Waste',
    financialLoss: 1800,
    createdAt: '2026-07-18T16:30:00Z',
  },
];

export const MOCK_WASTE_REASONS_CHART = [
  { name: 'Spoilage (Expired)', value: 55.4, color: '#EF4444' },
  { name: 'Overproduction', value: 24.6, color: '#F59E0B' },
  { name: 'Preparation Waste', value: 12.0, color: '#3B82F6' },
  { name: 'Storage Failure', value: 8.0, color: '#8B5CF6' },
];

export const MOCK_WEEKLY_LOSS_CHART = [
  { day: 'Mon', loss: 12400 },
  { day: 'Tue', loss: 9800 },
  { day: 'Wed', loss: 15200 },
  { day: 'Thu', loss: 11000 },
  { day: 'Fri', loss: 8400 },
  { day: 'Sat', loss: 14500 },
  { day: 'Sun', loss: 16800 },
];
