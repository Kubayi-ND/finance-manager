
import { useState, useEffect } from "react";
import { z } from "zod";
import { format } from "date-fns";
import ReportForm from "@/components/reports/ReportForm";
import IncomeStatement from "@/components/reports/IncomeStatement";
import ExpenseReport from "@/components/reports/ExpenseReport";
import SalesReport from "@/components/reports/SalesReport";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Define interfaces for the data types
interface IncomeStatementData {
  revenues: { category: string; amount: number }[];
  expenses: { category: string; amount: number }[];
}

interface ExpenseReportData {
  expenses: { category: string; amount: number }[];
  monthlyTrend: { month: string; amount: number }[];
}

interface SalesReportData {
  sales: { product: string; quantity: number; revenue: number }[];
  monthlySales: { month: string; revenue: number }[];
  topCustomers: { name: string; revenue: number }[];
}

// Fallback mock data
const fallbackData = {
  incomeStatement: {
    revenues: [
      { category: "Product Sales", amount: 25000 },
      { category: "Services", amount: 15000 },
      { category: "Investments", amount: 2000 },
    ],
    expenses: [
      { category: "Salaries", amount: 12000 },
      { category: "Rent", amount: 2000 },
      { category: "Utilities", amount: 1000 },
      { category: "Marketing", amount: 1500 },
      { category: "Office Supplies", amount: 500 },
      { category: "Software", amount: 750 },
    ],
  },
  expenseReport: {
    expenses: [
      { category: "Salaries", amount: 12000 },
      { category: "Rent", amount: 2000 },
      { category: "Utilities", amount: 1000 },
      { category: "Marketing", amount: 1500 },
      { category: "Office Supplies", amount: 500 },
      { category: "Software", amount: 750 },
    ],
    monthlyTrend: [
      { month: "Jan", amount: 1500 },
      { month: "Feb", amount: 1750 },
      { month: "Mar", amount: 1900 },
      { month: "Apr", amount: 1650 },
      { month: "May", amount: 2100 },
    ]
  },
  salesReport: {
    sales: [
      { product: "Product A", quantity: 150, revenue: 12500 },
      { product: "Product B", quantity: 85, revenue: 8500 },
      { product: "Service C", quantity: 45, revenue: 9000 },
      { product: "Product D", quantity: 65, revenue: 7800 },
    ],
    monthlySales: [
      { month: "Jan", revenue: 7500 },
      { month: "Feb", revenue: 8200 },
      { month: "Mar", revenue: 9800 },
      { month: "Apr", revenue: 9300 },
      { month: "May", revenue: 10200 },
    ],
    topCustomers: [
      { name: "ABC Corp", revenue: 8750 },
      { name: "XYZ Ltd", revenue: 6800 },
      { name: "123 Industries", revenue: 5200 },
      { name: "Smith & Co", revenue: 3500 },
    ]
  }
};

const reportSchema = z.object({
  reportType: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

export default function Reports() {
  const [reportData, setReportData] = useState<z.infer<typeof reportSchema> | null>(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [incomeData, setIncomeData] = useState<IncomeStatementData>(fallbackData.incomeStatement);
  const [expenseData, setExpenseData] = useState<ExpenseReportData>(fallbackData.expenseReport);
  const [salesData, setSalesData] = useState<SalesReportData>(fallbackData.salesReport);
  
  // Function to fetch data for income statement
  const fetchIncomeStatementData = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      
      // Format dates for database query
      const formattedStartDate = format(startDate, 'yyyy-MM-dd') + 'T00:00:00';
      const formattedEndDate = format(endDate, 'yyyy-MM-dd') + 'T23:59:59';
      
      // Fetch income records for revenue
      const { data: incomeRecords, error: incomeError } = await supabase
        .from('income_records')
        .select('source, amount')
        .gte('date', formattedStartDate)
        .lte('date', formattedEndDate);
      
      if (incomeError) throw incomeError;
      
      // Fetch customer invoices for revenue
      const { data: customerInvoices, error: customerError } = await supabase
        .from('customer_invoices')
        .select('customer_name, amount')
        .eq('status', 'Paid') // Only count paid invoices
        .gte('date', formattedStartDate)
        .lte('date', formattedEndDate);
      
      if (customerError) throw customerError;
      
      // Fetch expense records
      const { data: expenseRecords, error: expenseError } = await supabase
        .from('expense_records')
        .select('category, amount')
        .gte('date', formattedStartDate)
        .lte('date', formattedEndDate);
      
      if (expenseError) throw expenseError;
      
      // Process revenue data
      const revenueBySource: Record<string, number> = {};
      
      // Process income records
      incomeRecords?.forEach(record => {
        const source = record.source || 'Other';
        revenueBySource[source] = (revenueBySource[source] || 0) + Number(record.amount);
      });
      
      // Process customer invoices
      customerInvoices?.forEach(invoice => {
        const source = 'Sales to ' + (invoice.customer_name || 'Customers');
        revenueBySource[source] = (revenueBySource[source] || 0) + Number(invoice.amount);
      });
      
      // Process expense data
      const expensesByCategory: Record<string, number> = {};
      
      expenseRecords?.forEach(record => {
        const category = record.category || 'Other';
        expensesByCategory[category] = (expensesByCategory[category] || 0) + Number(record.amount);
      });
      
      // Transform data to the required format
      const revenues = Object.entries(revenueBySource).map(([category, amount]) => ({
        category,
        amount
      }));
      
      const expenses = Object.entries(expensesByCategory).map(([category, amount]) => ({
        category,
        amount
      }));
      
      setIncomeData({ revenues, expenses });
      return { success: true };
    } catch (err: any) {
      console.error('Error fetching income statement data:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch data for expense report
  const fetchExpenseReportData = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      
      // Format dates for database query
      const formattedStartDate = format(startDate, 'yyyy-MM-dd') + 'T00:00:00';
      const formattedEndDate = format(endDate, 'yyyy-MM-dd') + 'T23:59:59';
      
      // Fetch expense records
      const { data: expenseRecords, error: expenseError } = await supabase
        .from('expense_records')
        .select('category, date, amount')
        .gte('date', formattedStartDate)
        .lte('date', formattedEndDate);
      
      if (expenseError) throw expenseError;
      
      // Process expense categories
      const expensesByCategory: Record<string, number> = {};
      const expensesByMonth: Record<string, number> = {};
      
      expenseRecords?.forEach(record => {
        // Process category
        const category = record.category || 'Other';
        expensesByCategory[category] = (expensesByCategory[category] || 0) + Number(record.amount);
        
        // Process month
        try {
          const date = new Date(record.date);
          if (!isNaN(date.getTime())) {
            const monthName = format(date, 'MMM');
            expensesByMonth[monthName] = (expensesByMonth[monthName] || 0) + Number(record.amount);
          }
        } catch (err) {
          console.warn('Invalid date in expense record:', record);
        }
      });
      
      // Transform data to the required format
      const expenses = Object.entries(expensesByCategory).map(([category, amount]) => ({
        category,
        amount
      }));
      
      const monthlyTrend = Object.entries(expensesByMonth).map(([month, amount]) => ({
        month,
        amount
      }));
      
      setExpenseData({ expenses, monthlyTrend });
      return { success: true };
    } catch (err: any) {
      console.error('Error fetching expense report data:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch data for sales report
  const fetchSalesReportData = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      
      // Format dates for database query
      const formattedStartDate = format(startDate, 'yyyy-MM-dd') + 'T00:00:00';
      const formattedEndDate = format(endDate, 'yyyy-MM-dd') + 'T23:59:59';
      
      // Fetch customer invoices
      const { data: customerInvoices, error: customerError } = await supabase
        .from('customer_invoices')
        .select('customer_name, invoice_number, date, amount, status')
        .gte('date', formattedStartDate)
        .lte('date', formattedEndDate);
      
      if (customerError) throw customerError;
      
      // Process sales data
      const salesByProduct: Record<string, { quantity: number; revenue: number }> = {};
      const salesByMonth: Record<string, number> = {};
      const salesByCustomer: Record<string, number> = {};
      
      customerInvoices?.forEach(invoice => {
        const productName = `Invoice #${invoice.invoice_number || 'Unknown'}`;
        
        // Count each invoice as one product
        if (!salesByProduct[productName]) {
          salesByProduct[productName] = { quantity: 0, revenue: 0 };
        }
        salesByProduct[productName].quantity += 1;
        salesByProduct[productName].revenue += Number(invoice.amount);
        
        // Process by month
        try {
          const date = new Date(invoice.date);
          if (!isNaN(date.getTime())) {
            const monthName = format(date, 'MMM');
            salesByMonth[monthName] = (salesByMonth[monthName] || 0) + Number(invoice.amount);
          }
        } catch (err) {
          console.warn('Invalid date in customer invoice:', invoice);
        }
        
        // Process by customer
        const customerName = invoice.customer_name || 'Unknown Customer';
        salesByCustomer[customerName] = (salesByCustomer[customerName] || 0) + Number(invoice.amount);
      });
      
      // Transform data to the required format
      const sales = Object.entries(salesByProduct).map(([product, data]) => ({
        product,
        quantity: data.quantity,
        revenue: data.revenue
      }));
      
      const monthlySales = Object.entries(salesByMonth).map(([month, revenue]) => ({
        month,
        revenue
      }));
      
      // Sort customers by revenue and take top 5
      const topCustomers = Object.entries(salesByCustomer)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, revenue]) => ({ name, revenue }));
      
      setSalesData({ sales, monthlySales, topCustomers });
      return { success: true };
    } catch (err: any) {
      console.error('Error fetching sales report data:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (data: z.infer<typeof reportSchema>) => {
    // Check if dates are valid
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (data.startDate >= today || data.endDate >= today) {
      setError("Invalid time selection. Report dates must be in the past.");
      setReportGenerated(false);
      return;
    }
    
    // Clear any previous errors
    setError("");
    setReportGenerated(false);
    
    try {
      // Fetch data based on report type
      let result;
      
      switch (data.reportType) {
        case "income-statement":
          result = await fetchIncomeStatementData(data.startDate, data.endDate);
          break;
        case "expense-report":
          result = await fetchExpenseReportData(data.startDate, data.endDate);
          break;
        case "sales-report":
          result = await fetchSalesReportData(data.startDate, data.endDate);
          break;
        default:
          setError(`Report type "${data.reportType}" is not supported.`);
          return;
      }
      
      if (!result.success) {
        setError(result.error || "Failed to fetch report data.");
        return;
      }
      
      // Set the report data
      setReportData(data);
      setReportGenerated(true);
    } catch (err: any) {
      console.error("Error generating report:", err);
      setError(err.message || "An unknown error occurred.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <ReportForm onGenerate={handleGenerateReport} />
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
          <div>          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <p>Loading report data...</p>
            </div>
          ) : reportGenerated && reportData ? (
            (() => {
              switch (reportData.reportType) {
                case "income-statement":
                  return (
                    <IncomeStatement 
                      startDate={reportData.startDate} 
                      endDate={reportData.endDate} 
                      data={incomeData} 
                    />
                  );
                case "expense-report":
                  return (
                    <ExpenseReport 
                      startDate={reportData.startDate} 
                      endDate={reportData.endDate} 
                      data={expenseData} 
                    />
                  );
                case "sales-report":
                  return (
                    <SalesReport 
                      startDate={reportData.startDate} 
                      endDate={reportData.endDate} 
                      data={salesData} 
                    />
                  );
                default:
                  return (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">
                        {reportData.reportType.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} 
                        report is not available
                      </p>
                    </div>
                  );
              }
            })()
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                Select report type and date range, then click "Generate Report"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
