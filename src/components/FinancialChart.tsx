// src/components/FinancialChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancialData {
  period: string;
  revenue?: number;
  netIncome?: number;
  assets?: number;
  liabilities?: number;
  equity?: number;
  cash?: number;
  operatingCashFlow?: number;
}

interface FinancialChartProps {
  data: FinancialData[];
  title?: string;
}

export default function FinancialChart({ data, title = 'Financial Trends' }: FinancialChartProps) {
  // Format data for chart (reverse to show oldest first)
  const chartData = [...data].reverse().map((item) => ({
    period: item.period,
    revenue: item.revenue ? item.revenue / 1000000000 : 0, // Convert to billions
    netIncome: item.netIncome ? item.netIncome / 1000000000 : 0,
  }));

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${entry.value.toFixed(2)}B
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        📈 {title}
      </h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="period" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Billions ($)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3b82f6" 
            strokeWidth={3}
            name="Revenue"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="netIncome" 
            stroke="#10b981" 
            strokeWidth={3}
            name="Net Income"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Revenue (Quarterly)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Net Income (Quarterly)</span>
        </div>
      </div>
    </div>
  );
}
