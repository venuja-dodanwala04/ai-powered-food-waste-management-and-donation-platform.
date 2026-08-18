import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

interface WeeklyLossChartProps {
  data: Array<{ day: string; loss: number }>;
}

export const WeeklyLossChart: React.FC<WeeklyLossChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2F54" vertical={false} />
          <XAxis dataKey="day" stroke="#A7ADC2" fontSize={12} tickLine={false} />
          <YAxis
            stroke="#A7ADC2"
            fontSize={12}
            tickLine={false}
            tickFormatter={(val) => `LKR ${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#10142D',
              borderColor: '#2A2F54',
              borderRadius: '0.75rem',
              color: '#FFF',
              fontSize: '12px',
            }}
            formatter={(val: number) => [`LKR ${val.toLocaleString()}`, 'Financial Loss']}
          />
          <Bar dataKey="loss" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`bar-${index}`} fill={index === 4 ? '#EF4444' : '#3B82F6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
