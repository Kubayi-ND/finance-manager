
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceForm from "@/components/forms/InvoiceForm";
import DataTable from "@/components/dashboard/DataTable";
import { Plus } from "lucide-react";

// Mock data
const supplierInvoices = [
  {
    id: 1,
    supplierName: "ABC Suppliers",
    invoiceNumber: "INV-001",
    date: "2023-03-15",
    amount: 1250.00,
    paymentTerms: "Net 30",
    status: "Paid",
  },
  {
    id: 2,
    supplierName: "XYZ Corporation",
    invoiceNumber: "INV-002",
    date: "2023-03-20",
    amount: 3500.00,
    paymentTerms: "Net 15",
    status: "Pending",
  },
  {
    id: 3,
    supplierName: "Office Solutions",
    invoiceNumber: "INV-003",
    date: "2023-03-25",
    amount: 750.00,
    paymentTerms: "Net 30",
    status: "Paid",
  },
  {
    id: 4,
    supplierName: "Tech Distributors",
    invoiceNumber: "INV-004",
    date: "2023-03-28",
    amount: 2100.00,
    paymentTerms: "Net 45",
    status: "Overdue",
  },
  {
    id: 5,
    supplierName: "Global Imports",
    invoiceNumber: "INV-005",
    date: "2023-03-30",
    amount: 4250.00,
    paymentTerms: "Net 30",
    status: "Pending",
  },
];

export default function SupplierInvoices() {
  const [activeTab, setActiveTab] = useState("list");
  
  const columns = [
    { header: "Supplier", accessorKey: "supplierName" },
    { header: "Invoice #", accessorKey: "invoiceNumber" },
    { header: "Date", accessorKey: "date" },
    { 
      header: "Amount", 
      accessorKey: "amount",
      cell: (item: any) => `$${item.amount.toFixed(2)}`
    },
    { header: "Payment Terms", accessorKey: "paymentTerms" },
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
        <h1 className="text-2xl font-bold tracking-tight">Supplier Invoices</h1>
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
            data={supplierInvoices} 
            columns={columns}
            title="Supplier Invoices"
            onRowClick={() => {}}
          />
        </TabsContent>
        <TabsContent value="create" className="mt-6">
          <InvoiceForm 
            type="supplier" 
            onSuccess={() => setActiveTab("list")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
