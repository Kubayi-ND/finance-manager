import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download} from "lucide-react";
import { formatExpenseReportForExport, exportToExcel } from "@/lib/excel-export";

interface ExpenseReportProps {
  startDate: Date;
  endDate: Date;
  data: {
    expenses: { category: string; amount: number }[];
    monthlyTrend: { month: string; amount: number }[];
  };
}

export default function ExpenseReport({ 
  startDate, 
  endDate, 
  data 
}: ExpenseReportProps) {
  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  const largestCategory = data.expenses.reduce(
    (max, item) => (item.amount > max.amount ? item : max),
    { category: "", amount: 0 }
  );
  
  // Handle export to Excel
  const handleExport = () => {
    const formattedData = formatExpenseReportForExport(data, startDate, endDate);
    exportToExcel(formattedData, 'ExpenseReport');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Expense Report</CardTitle>
            <CardDescription>
              {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
            </CardDescription>
          </div>          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Summary</h3>
              <span className="text-lg font-bold">${totalExpenses.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            
            <div className="grid gap-4 grid-cols-2">
              <div className="p-3 bg-muted rounded">
                <p className="text-sm text-muted-foreground">Largest Expense Category</p>
                <p className="font-medium">{largestCategory.category}</p>
                <p className="font-bold">${largestCategory.amount.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="text-sm text-muted-foreground">Avg. Monthly Expenses</p>
                <p className="font-medium">${(totalExpenses / data.monthlyTrend.length).toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Expense Categories</h3>
            <Separator className="my-2" />
            
            <div className="space-y-2">
              {data.expenses.sort((a, b) => b.amount - a.amount).map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.category}</span>
                  <span>${item.amount.toFixed(2)}</span>
                </div>
              ))}
              
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Expenses</span>
                <span>${totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Monthly Trend</h3>
            <Separator className="my-2" />
            
            <div className="space-y-2">
              {data.monthlyTrend.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.month}</span>
                  <span>${item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
