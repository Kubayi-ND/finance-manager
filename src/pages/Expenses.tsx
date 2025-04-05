
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionForm from "@/components/forms/TransactionForm";
import DataTable from "@/components/dashboard/DataTable";
import { Plus } from "lucide-react";

// Mock data
const expenses = [
  {
    id: 1,
    category: "Utilities",
    date: "2023-03-05",
    amount: 450.00,
    description: "Monthly electricity and water bills",
  },
  {
    id: 2,
    category: "Rent",
    date: "2023-03-01",
    amount: 2000.00,
    description: "Office space monthly rent",
  },
  {
    id: 3,
    category: "Salaries",
    date: "2023-03-28",
    amount: 8500.00,
    description: "Employee salaries for March",
  },
  {
    id: 4,
    category: "Office Supplies",
    date: "2023-03-12",
    amount: 350.00,
    description: "Paper, ink, and other office supplies",
  },
  {
    id: 5,
    category: "Software",
    date: "2023-03-15",
    amount: 750.00,
    description: "Annual software subscriptions",
  },
];

export default function Expenses() {
  const [activeTab, setActiveTab] = useState("list");
  
  const columns = [
    { header: "Category", accessorKey: "category" },
    { header: "Date", accessorKey: "date" },
    { 
      header: "Amount", 
      accessorKey: "amount",
      cell: (item: any) => `$${item.amount.toFixed(2)}`
    },
    { header: "Description", accessorKey: "description" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
        {activeTab === "list" && (
          <Button onClick={() => setActiveTab("create")}>
            <Plus className="h-4 w-4 mr-2" />
            New Expense
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Expense List</TabsTrigger>
          <TabsTrigger value="create">Record Expense</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-6">
          <DataTable 
            data={expenses} 
            columns={columns}
            title="Expenses"
            onRowClick={() => {}}
          />
        </TabsContent>
        <TabsContent value="create" className="mt-6">
          <TransactionForm 
            type="expense" 
            onSuccess={() => setActiveTab("list")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
