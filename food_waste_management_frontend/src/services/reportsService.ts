class ReportsService {
  getSummaryMetrics(range: string = '30 Days') {
    return {
      totalSalesVolumeKg: 4850,
      totalWasteKg: 184.2,
      wasteReductionPercent: 24.8,
      foodDonatedKg: 420.0,
      estimatedFinancialSavingsLKR: 345000,
      co2SavedKg: 1050,
      mealsDonated: 1260,
      donationBeneficiaries: 840,
    };
  }

  exportCSVReport() {
    const csvContent =
      'Date,Category,Item,Quantity(kg),Status,FinancialLoss(LKR)\n' +
      '2026-07-19,Prepared Food,Chicken Curry,3.5,Wasted,4200\n' +
      '2026-07-19,Vegetables,Mixed Salad,6.5,Donated,0\n' +
      '2026-07-18,Bakery,Bread Breads,10.0,Donated,0\n' +
      '2026-07-18,Prepared Food,Penne Pasta,3.0,Wasted,2400\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EcoKitchen_AI_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const reportsService = new ReportsService();
