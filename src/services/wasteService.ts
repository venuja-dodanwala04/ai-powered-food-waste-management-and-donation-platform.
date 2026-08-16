import { WasteEntry } from '../types';
import { MOCK_WASTE_ENTRIES, MOCK_WASTE_REASONS_CHART, MOCK_WEEKLY_LOSS_CHART } from '../data/mockWaste';

class WasteService {
  private wasteEntries: WasteEntry[] = [...MOCK_WASTE_ENTRIES];

  getWasteLogs(): WasteEntry[] {
    return [...this.wasteEntries];
  }

  logWaste(entry: Omit<WasteEntry, 'id' | 'createdAt'>): WasteEntry {
    const newEntry: WasteEntry = {
      ...entry,
      id: `waste_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.wasteEntries.unshift(newEntry);
    return newEntry;
  }

  getReasonsChartData() {
    return MOCK_WASTE_REASONS_CHART;
  }

  getWeeklyLossChartData() {
    return MOCK_WEEKLY_LOSS_CHART;
  }
}

export const wasteService = new WasteService();
