import React from 'react';
import { History, HeartHandshake, Award } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';

export const CharityHistoryPage: React.FC = () => {
  const history = [
    {
      id: 'h_1',
      donorName: 'Grand Colombo',
      foodName: 'Assorted Fresh Bakery Breads',
      quantity: '10.0 kg',
      date: 'July 18, 2026',
      mealsDistributed: 30,
      status: 'Collected',
    },
    {
      id: 'h_2',
      donorName: 'Kingsbury Hotel',
      foodName: 'Rice & Vegetable Curry',
      quantity: '25.0 kg',
      date: 'July 15, 2026',
      mealsDistributed: 75,
      status: 'Collected',
    },
    {
      id: 'h_3',
      donorName: 'Cargills Food City',
      foodName: 'Fresh Fruit Mix',
      quantity: '18.0 kg',
      date: 'July 12, 2026',
      mealsDistributed: 54,
      status: 'Collected',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collection History & Impact Log"
        subtitle="Review completed surplus food collections and community meal distribution totals."
      />

      <div className="eco-card p-6 bg-eco-gradient-accent border-eco-green/40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-eco-purple/20 text-eco-purple border border-eco-purple/40 shadow-glow-purple">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-outfit">
              Total Community Impact — Hope Food Bank
            </h3>
            <p className="text-xs text-eco-muted mt-0.5">
              Collected <strong>420 kg of surplus food</strong> feeding over <strong>1,260 individuals</strong> in Sri Lanka this month.
            </p>
          </div>
        </div>
      </div>

      <div className="eco-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-eco-border text-xs text-eco-muted uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Donor Business</th>
                <th className="py-3 px-4 font-semibold">Food Item</th>
                <th className="py-3 px-4 font-semibold">Quantity</th>
                <th className="py-3 px-4 font-semibold">Meals Distributed</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-eco-border/40 text-xs">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-eco-surface/40">
                  <td className="py-3.5 px-4 text-eco-muted font-medium">{item.date}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{item.donorName}</td>
                  <td className="py-3.5 px-4 text-eco-muted">{item.foodName}</td>
                  <td className="py-3.5 px-4 font-bold text-eco-green">{item.quantity}</td>
                  <td className="py-3.5 px-4 font-semibold text-eco-purple">{item.mealsDistributed} Meals</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
