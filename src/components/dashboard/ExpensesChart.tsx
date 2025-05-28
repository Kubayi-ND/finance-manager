import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ExpensesChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export default function ExpensesChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchExpensesData() {
      try {
        const { data: expenseRecords, error } = await supabase
          .from('expense_records')
          .select('category, amount');

        if (error) throw error;

        const aggregatedData = expenseRecords.reduce((acc, record) => {
          const existingCategory = acc.find(item => item.name === record.category);
          if (existingCategory) {
            existingCategory.value += record.amount;
          } else {
            acc.push({ name: record.category, value: record.amount, color: getRandomColor() });
          }
          return acc;
        }, []);

        setData(aggregatedData);
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    }

    fetchExpensesData();
  }, []);

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
