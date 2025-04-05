
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceForm from "@/components/forms/InvoiceForm";
import DataTable from "@/components/dashboard/DataTable";
import { Plus } from "lucide-react";

// Mock data
const customerInvoices = [
  {
    id: 1,
    customerName: "Acme Corp",
    invoiceNumber: "INV-101",
    date: "2023-03-10",
    amount: 2500.00,
    dueDate: "2023-04-10",
    status: "Paid",
  },
  {
    id: 2,
    customerName: "Smith Enterprises",
    invoiceNumber: "INV-102",
    date: "2023-03-15",
    amount: 3750.00,
    dueDate: "2023-04-15",
    status: "Pending",
  },
  {
    id: 3,
    customerName: "Johnson & Co",
    invoiceNumber: "INV-103",
    date: "2023-03-18",
    amount: 1850.00,
    dueDate: "2023-04-18",
    status: "Overdue",
  },
  {
    id: 4,
    customerName: "Bright Solutions",
    invoiceNumber: "INV-104",
    date: "2023-03-22",
    amount: 4200.00,
    dueDate: "2023-04-22",
    status: "Pending",
  },
  {
    id: 5,
    customerName: "Tech Innovators",
    invoiceNumber: "INV-105",
    date: "2023-03-28",
    amount: 5500.00,
    dueDate: "2023-04-28",
    status: "Paid",
  },
];

export default function CustomerInvoices() {
  const [activeTab, setActiveTab] = useState("list");
  
  const columns = [
    { header: "Customer", accessorKey: "customerName" },
    { header: "Invoice #", accessorKey: "invoiceNumber" },
    { header: "Date", accessorKey: "date" },
    { 
      header: "Amount", 
      accessorKey: "amount",
      cell: (item: any) => `$${item.amount.toFixed(2)}`
    },
    { header: "Due Date", accessorKey: "dueDate" },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (item: any) => (
        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${
          item.status === "Paid" 
            ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
            : item.status === "Pending" 
            ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {item.status}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Customer Invoices</h1>
        {activeTab === "list" && (
          <Button onClick={() => setActiveTab("create")}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Invoice List</TabsTrigger>
          <TabsTrigger value="create">Create Invoice</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-6">
          <DataTable 
            data={customerInvoices} 
            columns={columns}
            title="Customer Invoices"
            onRowClick={() => {}}
          />
        </TabsContent>
        <TabsContent value="create" className="mt-6">
          <InvoiceForm 
            type="customer" 
            onSuccess={() => setActiveTab("list")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
