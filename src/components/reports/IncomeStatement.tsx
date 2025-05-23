
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
import { formatIncomeStatementForExport, exportToExcel } from "@/lib/excel-export";

interface IncomeStatementProps {
  startDate: Date;
  endDate: Date;
  data: {
    revenues: { category: string; amount: number }[];
    expenses: { category: string; amount: number }[];
  };
}

export default function IncomeStatement({ 
  startDate, 
  endDate, 
  data 
}: IncomeStatementProps) {
  const totalRevenue = data.revenues.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  
  // Handle export to Excel
  const handleExport = () => {
    const formattedData = formatIncomeStatementForExport(data, startDate, endDate);
    exportToExcel(formattedData, 'IncomeStatement');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Income Statement</CardTitle>
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
            <h3 className="text-lg font-semibold">Revenue</h3>
            <Separator className="my-2" />
            
            <div className="space-y-2">
              {data.revenues.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.category}</span>
                  <span>${item.amount.toFixed(2)}</span>
                </div>
              ))}
              
              <div className="flex justify-between font-medium pt-2">
                <span>Total Revenue</span>
                <span>${totalRevenue.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Expenses</h3>
            <Separator className="my-2" />
            
            <div className="space-y-2">
              {data.expenses.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.category}</span>
                  <span>${item.amount.toFixed(2)}</span>
                </div>
              ))}
              
              <div className="flex justify-between font-medium pt-2">
                <span>Total Expenses</span>
                <span>${totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <Separator className="my-4" />
            <div className="flex justify-between text-lg font-bold">
              <span>Net Profit</span>
              <span className={netProfit >= 0 ? "text-green-600" : "text-red-600"}>
                ${netProfit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
