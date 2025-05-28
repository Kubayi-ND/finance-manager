import { useState, useEffect } from "react";
import { DollarSign, Package, Wallet } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ExpensesChart from "@/components/dashboard/ExpensesChart";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Color palette for expense categories
const categoryColors = {
  "Utilities": "#10b981",
  "Rent": "#2563eb",
  "Salaries": "#f59e0b",
  "Marketing": "#ef4444",
  "Office Supplies": "#8b5cf6",
  "Travel": "#0891b2",
  "Insurance": "#f97316",
  "Maintenance": "#a855f7",
  "Software": "#06b6d4",
  "Other": "#6b7280"
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2
  }).format(amount);
};

export default function Dashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for each data type
  const [transactions, setTransactions] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [expensesData, setExpensesData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    profit: 0
  });

  // Fetch all data on component mount  
  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError(null);
      
      try {
        // Check if database tables exist first
        const { data: tableInfo, error: tableError } = await supabase
          .from('expense_records')
          .select('id')
          .limit(1);
          
        if (tableError) {
          console.error('Error checking database tables:', tableError);
          
          // Show a message about setting up the database
          toast({
            title: 'Database setup required',
            description: 'Please ensure your database tables are set up correctly',
            variant: 'default'
          });
          
        } else {
          // Database exists, load real data
          await Promise.all([
            fetchTransactions(),
            fetchRevenueData(),
            fetchExpenseBreakdown(),
            fetchStats(),
          ]);
        }
      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
        setError(err.message);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);
  
  // Fetch recent transactions from all sources
  async function fetchTransactions() {
    try {
      const { data: income, error: incomeError } = await supabase
        .from('income_records')
        .select('*')
        .limit(100);
      
      if (incomeError) throw incomeError;
      
      const sortedTransactions = income
        .map(income => ({
          id: income.id,
          description: income.description || income.category,
          date: income.date,
          amount: income.amount,
          type: 'Expense',
          status: 'Paid'
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setTransactions(sortedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Fetch monthly revenue and expense data for chart
  async function fetchRevenueData() {
    try {
      const currentYear = new Date().getFullYear();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Initialize revenue data with zero values
      const initialRevenueData = months.map(month => ({
        month,
        revenue: 0,
        expenses: 0
      }));
        // Get expenses
      const { data: expenseRecords, error: expenseError } = await supabase
        .from('expense_records')
        .select('date, amount')
        .gte('date', `${currentYear}-01-01T00:00:00`)
        .lte('date', `${currentYear}-12-31T23:59:59`);
        
      if (expenseError) throw expenseError;
        // Process revenue data with better error handling
      expenseRecords?.forEach(record => {
        try {
          const date = new Date(record.date);
          if (!isNaN(date.getTime())) { // Check if date is valid
            const monthIndex = date.getMonth();
            initialRevenueData[monthIndex].expenses += Number(record.amount);
          } else {
            console.warn(`Invalid date found in expense record:`, record);
          }
        } catch (err) {
          console.error(`Error processing expense record:`, record, err);
        }
      });
      
      setRevenueData(initialRevenueData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  }
  // Fetch expense breakdown by category
  async function fetchExpenseBreakdown() {
    try {
      // Skip RPC call which doesn't exist yet and directly use manual calculation
      const { data: expenses, error: expensesError } = await supabase
        .from('expense_records')
        .select('category, amount');
        
      if (expensesError) throw expensesError;
      
      // Manually calculate category totals
      const categoryTotals: Record<string, number> = {};
      expenses?.forEach(expense => {
        const category = expense.category || 'Other';
        categoryTotals[category] = (categoryTotals[category] || 0) + Number(expense.amount);
      });
      
      // Transform to chart format
      const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
        color: (categoryColors as any)[name] || "#6b7280" // Default to gray if no color defined
      }));
      
      setExpensesData(chartData);
    } catch (error) {
      console.error('Error fetching expense breakdown:', error);
      throw error;
    }
  }

  // Fetch stats for the StatCards
  async function fetchStats() {
    try {
      const { data: incomeRecords, error: incomeError } = await supabase
        .from('income_records')
        .select('amount');

      if (incomeError) throw incomeError;

      const { data: expenseRecords, error: expenseError } = await supabase
        .from('expense_records')
        .select('amount');

      if (expenseError) throw expenseError;

      const totalIncome = incomeRecords?.reduce((sum, record) => sum + Number(record.amount), 0) || 0;
      const totalExpenses = expenseRecords?.reduce((sum, record) => sum + Number(record.amount), 0) || 0;
      const profit = totalIncome - totalExpenses;

      setStats({ totalIncome, totalExpenses, profit });
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  const transactionColumns = [
    { header: "Description", accessorKey: "description" },
    { 
      header: "Date", 
      accessorKey: "date",
      cell: (item: any) => format(new Date(item.date), 'dd MMM yyyy')
    },
    { 
      header: "Amount", 
      accessorKey: "amount",
      cell: (item: any) => formatCurrency(item.amount)
    }
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <p>Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          Error: {error}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard 
              title="Profit" 
              value={formatCurrency(stats.profit)} 
              description="All time profit" 
              icon={DollarSign}
              trend={10} // You could calculate this from monthly data
            />
            <StatCard 
              title="Total Income" 
              value={formatCurrency(stats.totalIncome)} 
              description="All time income" 
              icon={Wallet}
              trend={5} 
            />
            <StatCard 
              title="Total Expenses" 
              value={formatCurrency(stats.totalExpenses)} 
              description={stats.totalIncome > 0 
                ? `${Math.round((stats.totalExpenses / stats.totalIncome) * 100)}% of income` 
                : "No income yet"}
              icon={Package}
              trend={-5} 
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <RevenueChart data={revenueData} />
            <ExpensesChart data={expensesData} />
          </div>
          
          <DataTable 
            data={transactions} 
            columns={transactionColumns}
            title="Recent Income Transactions"
            onRowClick={() => {}}
          />
        </>
      )}
    </div>
  );
}
