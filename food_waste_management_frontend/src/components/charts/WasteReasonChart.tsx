import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface WasteReasonChartProps {
  data: Array<{ name: string; value: number; color: string }>;
}

export const WasteReasonChart: React.FC<WasteReasonChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#10142D',
              borderColor: '#2A2F54',
              borderRadius: '0.75rem',
              color: '#FFF',
              fontSize: '12px',
            }}
            formatter={(val: any) => [`${val}%`, 'Share']}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
