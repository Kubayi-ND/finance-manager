import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceForm from "@/components/forms/InvoiceForm";
import DataTable from "@/components/dashboard/DataTable";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface CustomerInvoice {
  id: number;
  customer_name: string;
  invoice_number: string;
  date: string;
  amount: number;
  due_date: string;
  status: "Paid" | "Pending" | "Overdue";
}

export default function CustomerInvoices() {
  const [activeTab, setActiveTab] = useState("list");
  const [customerInvoices, setCustomerInvoices] = useState<CustomerInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch customer invoices from Supabase
  useEffect(() => {
    async function fetchCustomerInvoices() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('customer_invoices')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setCustomerInvoices(data);
        }
      } catch (err: any) {
        console.error('Error fetching customer invoices:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomerInvoices();
  }, []);

  // Function to add a new customer invoice
  async function addCustomerInvoice(invoice: Omit<CustomerInvoice, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('customer_invoices')
        .insert([invoice])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setCustomerInvoices(prev => [...prev, data[0]]);
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Error adding customer invoice:', err);
      return { success: false, error: err.message };
    }
  }
  
  const columns = [
    { header: "Customer", accessorKey: "customer_name" },
    { header: "Invoice #", accessorKey: "invoice_number" },
    { header: "Date", accessorKey: "date" },
    { 
      header: "Amount", 
      accessorKey: "amount",
      cell: (item: any) => `R${item.amount.toFixed(2)}`
    },
    { header: "Due Date", accessorKey: "due_date" },
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
          {loading ? (
            <div className="flex justify-center p-8">
              <p>Loading customer invoices...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              Error: {error}
            </div>
          ) : (
            <DataTable 
              data={customerInvoices} 
              columns={columns}
              title="Customer Invoices"
              onRowClick={() => {}}
            />
          )}
        </TabsContent>
        <TabsContent value="create" className="mt-6">
          <InvoiceForm 
            type="customer" 
            onSuccess={(formData) => {
              // Convert form data to customer invoice format
              const newInvoice = {
                customer_name: formData.customerName,
                invoice_number: formData.invoiceNumber,
                date: formData.date,
                amount: parseFloat(formData.amount),
                due_date: formData.dueDate || formData.date,
                status: formData.status
              };
              
              addCustomerInvoice(newInvoice)
                .then(result => {
                  if (result.success) {
                    toast({
                      title: "Invoice added",
                      description: "Supplier invoice has been successfully added",
                      variant: "default"
                    });
                    setActiveTab("list");
                  } else {
                    toast({
                      title: "Error",
                      description: result.error || "Failed to add invoice",
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
