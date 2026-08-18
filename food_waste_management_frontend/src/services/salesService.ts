import { SalesEntry } from '../types';
import { MOCK_SALES } from '../data/mockSales';

class SalesService {
  private sales: SalesEntry[] = [...MOCK_SALES];

  getSalesLogs(): SalesEntry[] {
    return [...this.sales];
  }

  logSales(entry: Omit<SalesEntry, 'id'>): SalesEntry {
    const newEntry: SalesEntry = {
      ...entry,
      id: `sale_${Date.now()}`,
    };
    this.sales.unshift(newEntry);
    return newEntry;
  }
}

export const salesService = new SalesService();
