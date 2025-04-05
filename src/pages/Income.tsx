
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionForm from "@/components/forms/TransactionForm";
import DataTable from "@/components/dashboard/DataTable";
import { Plus } from "lucide-react";

// Mock data
const incomeRecords = [
  {
    id: 1,
    source: "Product Sales",
    date: "2023-03-05",
    amount: 3250.00,
    description: "Sale of products to retail customers",
  },
  {
    id: 2,
    source: "Services",
    date: "2023-03-10",
    amount: 4500.00,
    description: "Consulting services for Client XYZ",
  },
  {
    id: 3,
    source: "Investments",
    date: "2023-03-15",
    amount: 800.00,
    description: "Dividend income from investments",
  },
  {
    id: 4,
    source: "Product Sales",
    date: "2023-03-20",
    amount: 2750.00,
    description: "Sale of products to wholesale customers",
  },
  {
    id: 5,
    source: "Services",
    date: "2023-03-25",
    amount: 3800.00,
    description: "Consulting services for Client ABC",
  },
];

export default function Income() {
  const [activeTab, setActiveTab] = useState("list");
  
  const columns = [
    { header: "Source", accessorKey: "source" },
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
        <h1 className="text-2xl font-bold tracking-tight">Income</h1>
        {activeTab === "list" && (
          <Button onClick={() => setActiveTab("create")}>
            <Plus className="h-4 w-4 mr-2" />
            New Income
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Income List</TabsTrigger>
          <TabsTrigger value="create">Record Income</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-6">
          <DataTable 
            data={incomeRecords} 
            columns={columns}
            title="Income Records"
            onRowClick={() => {}}
          />
        </TabsContent>
        <TabsContent value="create" className="mt-6">
          <TransactionForm 
            type="income" 
            onSuccess={() => setActiveTab("list")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
