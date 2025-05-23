import { useState, useEffect } from "react";
import { BarChartBig, DollarSign, Package, Receipt, Wallet } from "lucide-react";
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
    totalRevenue: 0,
    customerInvoices: { total: 0, pending: 0, paid: 0 },
    supplierInvoices: { total: 0, pending: 0, paid: 0 },
    totalExpenses: 0
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
          
          // Load some sample data to display the UI
          setRevenueData(getSampleRevenueData());
          setExpensesData(getSampleExpenseData());
          setStats(getSampleStats());
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
  
  // Sample data functions for fallback
 
  
  function getSampleRevenueData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 10000) + 2000,
      expenses: Math.floor(Math.random() * 6000) + 1000
    }));
  }
  
  function getSampleExpenseData() {
    return [
      { name: "Rent", value: 3000, color: "#2563eb" },
      { name: "Utilities", value: 1500, color: "#10b981" },
      { name: "Salaries", value: 8000, color: "#f59e0b" },
      { name: "Supplies", value: 1200, color: "#8b5cf6" },
      { name: "Marketing", value: 2000, color: "#ef4444" }
    ];
  }
  
  function getSampleStats() {
    return {
      totalRevenue: 45231.89,
      customerInvoices: { total: 24500.00, pending: 8, paid: 12 },
      supplierInvoices: { total: 18400.00, pending: 4, paid: 10 },
      totalExpenses: 15000.00
    };
  }

  // Fetch recent transactions from all sources
  async function fetchTransactions() {
    try {      // Get customer invoices
      const { data: customerInvoices, error: customerError } = await supabase
        .from('customer_invoices')
        .select('*')
        .limit(5);
      
      if (customerError) throw customerError;
        // Get supplier invoices
      const { data: supplierInvoices, error: supplierError } = await supabase
        .from('supplier_invoices')
        .select('*')
        .limit(5);
      
      if (supplierError) throw supplierError;
        // Get expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expense_records')
        .select('*')
        .limit(5);
      
      if (expensesError) throw expensesError;
        // Get income
      const { data: incomes, error: incomesError } = await supabase
        .from('income_records')
        .select('*')
        .limit(5);
      
      if (incomesError) throw incomesError;
      
      // Transform and combine all transactions
      const allTransactions = [
        ...(customerInvoices?.map(invoice => ({
          id: invoice.id,
          description: `Invoice to ${invoice.customer_name}: ${invoice.invoice_number || ''}`,
          date: invoice.date,
          amount: invoice.amount,
          type: 'Customer Invoice',
          status: invoice.status
        })) || []),
        ...(supplierInvoices?.map(invoice => ({
          id: invoice.id,
          description: `Invoice from ${invoice.supplier_name}: ${invoice.invoice_number || ''}`,
          date: invoice.date,
          amount: invoice.amount,
          type: 'Supplier Invoice',
          status: invoice.status
        })) || []),
        ...(expenses?.map(expense => ({
          id: expense.id,
          description: expense.description || expense.category,
          date: expense.date,
          amount: expense.amount,
          type: 'Expense',
          status: 'Paid'
        })) || []),
        ...(incomes?.map(income => ({
          id: income.id,
          description: income.description || income.source,
          date: income.date,
          amount: income.amount,
          type: 'Income',
          status: 'Completed'
        })) || [])
      ];
      
      // Sort by date (newest first) and take top 10
      const sortedTransactions = allTransactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
      
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
        // Get customer invoices and income for revenue
      const { data: revenueRecords, error: revenueError } = await supabase
        .from('income_records')
        .select('date, amount')
        .gte('date', `${currentYear}-01-01T00:00:00`)
        .lte('date', `${currentYear}-12-31T23:59:59`);
        
      if (revenueError) throw revenueError;
        // Get customer invoices for revenue
      const { data: invoiceRecords, error: invoiceError } = await supabase
        .from('customer_invoices')
        .select('date, amount')
        .eq('status', 'Paid') // Only count paid invoices as revenue
        // Format dates with proper ISO format to avoid 400 errors
        .gte('date', `${currentYear}-01-01T00:00:00`)
        .lte('date', `${currentYear}-12-31T23:59:59`);
        
      if (invoiceError) throw invoiceError;
        // Get expenses
      const { data: expenseRecords, error: expenseError } = await supabase
        .from('expense_records')
        .select('date, amount')
        .gte('date', `${currentYear}-01-01T00:00:00`)
        .lte('date', `${currentYear}-12-31T23:59:59`);
        
      if (expenseError) throw expenseError;
        // Get supplier invoices as expenses
      const { data: supplierRecords, error: supplierError } = await supabase
        .from('supplier_invoices')
        .select('date, amount')
        .eq('status', 'Paid') // Only count paid invoices as expenses
        .gte('date', `${currentYear}-01-01T00:00:00`)
        .lte('date', `${currentYear}-12-31T23:59:59`);
        
      if (supplierError) throw supplierError;
        // Process revenue data with better error handling
      revenueRecords?.forEach(record => {
        try {
          const date = new Date(record.date);
          if (!isNaN(date.getTime())) { // Check if date is valid
            const monthIndex = date.getMonth();
            initialRevenueData[monthIndex].revenue += Number(record.amount);
          } else {
            console.warn(`Invalid date found in income record:`, record);
          }
        } catch (err) {
          console.error(`Error processing income record:`, record, err);
        }
      });
        invoiceRecords?.forEach(record => {
        try {
          const date = new Date(record.date);
          if (!isNaN(date.getTime())) { // Check if date is valid
            const monthIndex = date.getMonth();
            initialRevenueData[monthIndex].revenue += Number(record.amount);
          } else {
            console.warn(`Invalid date found in customer invoice:`, record);
          }
        } catch (err) {
          console.error(`Error processing customer invoice:`, record, err);
        }
      });
        // Process expense data with better error handling
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
        supplierRecords?.forEach(record => {
        try {
          const date = new Date(record.date);
          if (!isNaN(date.getTime())) { // Check if date is valid
            const monthIndex = date.getMonth();
            initialRevenueData[monthIndex].expenses += Number(record.amount);
          } else {
            console.warn(`Invalid date found in supplier invoice:`, record);
          }
        } catch (err) {
          console.error(`Error processing supplier invoice:`, record, err);
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
      // Calculate total revenue
      const { data: revenue, error: revenueError } = await supabase
        .from('income_records')
        .select('amount');
        
      if (revenueError) throw revenueError;
      
      // Get customer invoices
      const { data: customerInvoices, error: customerError } = await supabase
        .from('customer_invoices')
        .select('amount, status');
      
      if (customerError) throw customerError;
      
      // Get supplier invoices
      const { data: supplierInvoices, error: supplierError } = await supabase
        .from('supplier_invoices')
        .select('amount, status');
      
      if (supplierError) throw supplierError;
      
      // Calculate total expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expense_records')
        .select('amount');
        
      if (expensesError) throw expensesError;
      
      // Calculate totals and stats
      const totalRevenue = (
        (revenue?.reduce((sum, record) => sum + Number(record.amount), 0) || 0) +
        (customerInvoices?.reduce((sum, invoice) => sum + Number(invoice.amount), 0) || 0)
      );
      
      const customerInvoicesTotal = customerInvoices?.reduce((sum, invoice) => sum + Number(invoice.amount), 0) || 0;
      const customerInvoicesPending = customerInvoices?.filter(i => i.status === 'Pending').length || 0;
      const customerInvoicesPaid = customerInvoices?.filter(i => i.status === 'Paid').length || 0;
      
      const supplierInvoicesTotal = supplierInvoices?.reduce((sum, invoice) => sum + Number(invoice.amount), 0) || 0;
      const supplierInvoicesPending = supplierInvoices?.filter(i => i.status === 'Pending').length || 0;
      const supplierInvoicesPaid = supplierInvoices?.filter(i => i.status === 'Paid').length || 0;
      
      const totalExpenses = (
        (expenses?.reduce((sum, record) => sum + Number(record.amount), 0) || 0) +
        (supplierInvoices?.filter(i => i.status === 'Paid')
          .reduce((sum, invoice) => sum + Number(invoice.amount), 0) || 0)
      );
      
      setStats({
        totalRevenue,
        customerInvoices: {
          total: customerInvoicesTotal,
          pending: customerInvoicesPending,
          paid: customerInvoicesPaid
        },
        supplierInvoices: {
          total: supplierInvoicesTotal,
          pending: supplierInvoicesPending,
          paid: supplierInvoicesPaid
        },
        totalExpenses
      });
      
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
    },
    { header: "Type", accessorKey: "type" },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (item: any) => (
        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${
          item.status === "Paid" || item.status === "Completed" 
            ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
            : item.status === "Pending" 
            ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            : "bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
        }`}>
          {item.status}
        </div>
      )
    },
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Revenue" 
              value={formatCurrency(stats.totalRevenue)} 
              description="All time revenue" 
              icon={DollarSign}
              trend={10} // You could calculate this from monthly data
            />
            <StatCard 
              title="Customer Invoices" 
              value={formatCurrency(stats.customerInvoices.total)} 
              description={`${stats.customerInvoices.pending} pending, ${stats.customerInvoices.paid} paid`} 
              icon={Receipt}
              trend={5} 
            />
            <StatCard 
              title="Supplier Invoices" 
              value={formatCurrency(stats.supplierInvoices.total)} 
              description={`${stats.supplierInvoices.pending} pending, ${stats.supplierInvoices.paid} paid`} 
              icon={Package}
              trend={stats.supplierInvoices.pending > 0 ? -5 : 0}
            />
            <StatCard 
              title="Total Expenses" 
              value={formatCurrency(stats.totalExpenses)} 
              description={stats.totalRevenue > 0 
                ? `${Math.round((stats.totalExpenses / stats.totalRevenue) * 100)}% of revenue` 
                : "No revenue yet"}
              icon={Wallet}
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
            title="Recent Transactions"
            onRowClick={() => {}}
          />
        </>
      )}
    </div>
  );
}
