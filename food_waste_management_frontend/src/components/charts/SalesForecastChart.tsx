import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface SalesForecastChartProps {
  data: Array<{ day: string; actualSales: number; aiPredicted?: number }>;
}

export const SalesForecastChart: React.FC<SalesForecastChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2F54" vertical={false} />
          <XAxis dataKey="day" stroke="#A7ADC2" fontSize={12} tickLine={false} />
          <YAxis stroke="#A7ADC2" fontSize={12} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#10142D',
              borderColor: '#2A2F54',
              borderRadius: '0.75rem',
              color: '#FFF',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
          />
          <Line
            type="monotone"
            dataKey="actualSales"
            name="Actual Sales (kg)"
            stroke="#16E875"
            strokeWidth={3}
            dot={{ r: 4, fill: '#16E875' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="aiPredicted"
            name="AI Predicted (kg)"
            stroke="#3B82F6"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ r: 4, fill: '#3B82F6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
