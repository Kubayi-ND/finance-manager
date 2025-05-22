import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionForm from "@/components/forms/TransactionForm";
import DataTable from "@/components/dashboard/DataTable";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: number;
  category: string;
  date: string;
  amount: number;
  description: string;
}

export default function Expenses() {
  const [activeTab, setActiveTab] = useState("list");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch expenses from Supabase
  useEffect(() => {
    async function fetchExpenses() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('expense_records')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setExpenses(data);
        }
      } catch (err: any) {
        console.error('Error fetching expenses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, []);
  // Function to add a new expense
  async function addExpense(expense: Omit<Expense, 'id'>) {
    try {
      console.log('Adding expense to Supabase:', expense);
      const { data, error } = await supabase
        .from('expense_records')
        .insert([expense])
        .select();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (data) {
        console.log('Expense added successfully:', data[0]);
        setExpenses(prev => [...prev, data[0]]);
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Error adding expense:', err);
      return { success: false, error: err.message };
    }
  }
  
  const columns = [
    { header: "Category", accessorKey: "category" },
    { header: "Date", accessorKey: "date" },
    { 
      header: "Amount", 
      accessorKey: "amount",
      cell: (item: any) => `R${item.amount.toFixed(2)}`
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
          {loading ? (
            <div className="flex justify-center p-8">
              <p>Loading expenses...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              Error: {error}
            </div>
          ) : (
            <DataTable 
              data={expenses} 
              columns={columns}
              title="Expenses"
              onRowClick={() => {}}
            />
          )}
        </TabsContent>
        <TabsContent value="create" className="mt-6">          <TransactionForm 
            type="expense" 
            onSuccess={(formData) => {
              // Convert form data to expense format
              console.log('Expense form data received:', formData);
              const newExpense = {
                category: formData.category,
                date: formData.date,
                amount: parseFloat(formData.amount),
                description: formData.description || ''              };
              
              addExpense(newExpense)
                .then(result => {
                  if (result.success) {
                    toast({
                      title: "Expense added",
                      description: "Expense record has been successfully added",
                      variant: "default"
                    });
                    setActiveTab("list");
                  } else {
                    toast({
                      title: "Error",
                      description: result.error || "Failed to add expense record",
                      variant: "destructive"
                    });
                  }
                });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
