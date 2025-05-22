import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionForm from "@/components/forms/TransactionForm";
import DataTable from "@/components/dashboard/DataTable";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface IncomeRecord {
  id: number;
  source: string;
  date: string;
  amount: number;
  description: string;
}

export default function Income() {
  const [activeTab, setActiveTab] = useState("list");
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch income records from Supabase
  useEffect(() => {
    async function fetchIncomeRecords() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('income_records')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setIncomeRecords(data);
        }
      } catch (err: any) {
        console.error('Error fetching income records:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchIncomeRecords();
  }, []);

  // Function to add a new income record
  async function addIncomeRecord(record: Omit<IncomeRecord, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('income_records')
        .insert([record])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setIncomeRecords(prev => [...prev, data[0]]);
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Error adding income record:', err);
      return { success: false, error: err.message };
    }
  }
  
  const columns = [
    { header: "Source", accessorKey: "source" },
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
          {loading ? (
            <div className="flex justify-center p-8">
              <p>Loading income records...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              Error: {error}
            </div>
          ) : (
            <DataTable 
              data={incomeRecords} 
              columns={columns}
              title="Income Records"
              onRowClick={() => {}}
            />
          )}
        </TabsContent>
        <TabsContent value="create" className="mt-6">          <TransactionForm 
            type="income" 
            onSuccess={(formData) => {
              // Convert form data to income record format
              console.log('Income form data received:', formData);
              
              // Handle the form data according to the expected structure
              const newRecord = {
                source: formData.source,
                date: formData.date,
                amount: parseFloat(formData.amount),
                description: formData.description || ''
              };
              
              addIncomeRecord(newRecord)
                .then(result => {
                  if (result.success) {
                    toast({
                      title: "Income added",
                      description: "Income record has been successfully added",
                      variant: "default"
                    });
                    setActiveTab("list");
                  } else {
                    toast({
                      title: "Error",
                      description: result.error || "Failed to add income record",
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
