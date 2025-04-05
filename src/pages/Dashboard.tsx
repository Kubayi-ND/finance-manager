
import { BarChartBig, DollarSign, Package, Receipt, Wallet } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ExpensesChart from "@/components/dashboard/ExpensesChart";

// Mock data
const recentTransactions = [
  { 
    id: 1, 
    description: "ABC Suppliers Invoice", 
    date: "2023-04-01", 
    amount: 1250.00, 
    type: "Supplier Invoice", 
    status: "Paid" 
  },
  { 
    id: 2, 
    description: "XYZ Corp Payment", 
    date: "2023-04-02", 
    amount: 3200.00, 
    type: "Income", 
    status: "Completed" 
  },
  { 
    id: 3, 
    description: "Office Rent", 
    date: "2023-04-03", 
    amount: 2000.00, 
    type: "Expense", 
    status: "Paid" 
  },
  { 
    id: 4, 
    description: "Client ABC Invoice #1234", 
    date: "2023-04-04", 
    amount: 4500.00, 
    type: "Customer Invoice", 
    status: "Pending" 
  },
  { 
    id: 5, 
    description: "Utility Bills", 
    date: "2023-04-05", 
    amount: 450.00, 
    type: "Expense", 
    status: "Paid" 
  },
];

const revenueData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 9800, expenses: 4200 },
  { month: "Apr", revenue: 8080, expenses: 3908 },
  { month: "May", revenue: 10070, expenses: 4800 },
  { month: "Jun", revenue: 9390, expenses: 3800 },
];

const expensesData = [
  { name: "Rent", value: 3000, color: "#2563eb" },
  { name: "Utilities", value: 1500, color: "#10b981" },
  { name: "Salaries", value: 8000, color: "#f59e0b" },
  { name: "Supplies", value: 1200, color: "#8b5cf6" },
  { name: "Marketing", value: 2000, color: "#ef4444" },
];

export default function Dashboard() {
  const transactionColumns = [
    { header: "Description", accessorKey: "description" },
    { header: "Date", accessorKey: "date" },
    { 
      header: "Amount", 
      accessorKey: "amount",
      cell: (item: any) => `$${item.amount.toFixed(2)}`
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value="$45,231.89" 
          description="Total revenue this month" 
          icon={DollarSign}
          trend={12.5}
        />
        <StatCard 
          title="Customer Invoices" 
          value="$24,500.00" 
          description="8 pending, 12 paid" 
          icon={Receipt}
          trend={5.2}
        />
        <StatCard 
          title="Supplier Invoices" 
          value="$18,400.00" 
          description="4 pending, 10 paid" 
          icon={Package}
          trend={-2.5}
        />
        <StatCard 
          title="Total Expenses" 
          value="$15,000.00" 
          description="15% of revenue" 
          icon={Wallet}
          trend={-8.4}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart data={revenueData} />
        <ExpensesChart data={expensesData} />
      </div>
      
      <DataTable 
        data={recentTransactions} 
        columns={transactionColumns}
        title="Recent Transactions"
      />
    </div>
  );
}
