import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ProfitChartProps {
  data: {
    week: string;
    profit: number;
  }[];
}

export default function ProfitChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchProfitData() {
      try {
        const { data: incomeRecords, error: incomeError } = await supabase
          .from('income_records')
          .select('date, amount');

        if (incomeError) throw incomeError;

        const { data: expenseRecords, error: expenseError } = await supabase
          .from('expense_records')
          .select('date, amount');

        if (expenseError) throw expenseError;

        const aggregatedData = aggregateWeeklyProfit(incomeRecords, expenseRecords);
        setData(aggregatedData);
      } catch (error) {
        console.error('Error fetching profit data:', error);
      }
    }

    fetchProfitData();
  }, []);

  function aggregateWeeklyProfit(incomeRecords, expenseRecords) {
    const weeklyData: Record<string, { profit: number }> = {};

    incomeRecords.forEach(record => {
      const week = getWeekOfMonth(new Date(record.date));
      if (!weeklyData[week]) weeklyData[week] = { profit: 0 };
      weeklyData[week].profit += record.amount;
    });

    expenseRecords.forEach(record => {
      const week = getWeekOfMonth(new Date(record.date));
      if (!weeklyData[week]) weeklyData[week] = { profit: 0 };
      weeklyData[week].profit -= record.amount;
    });

    return Object.entries(weeklyData).map(([week, values]) => ({ week, profit: values.profit }));
  }

  function getWeekOfMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    const dayOfWeek = firstDayOfMonth.getDay();
    return `Week ${Math.ceil((dayOfMonth + dayOfWeek) / 7)}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit Overview</CardTitle>
        <CardDescription>
          Track profit per week across the month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis 
                dataKey="week" 
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R${value}`}
              />
              <Tooltip 
                formatter={(value) => [`R${value}`, undefined]} 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
