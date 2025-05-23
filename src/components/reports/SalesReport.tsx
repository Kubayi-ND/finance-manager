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
import { Download } from "lucide-react";
import { formatSalesReportForExport, exportToExcel } from "@/lib/excel-export";

interface SalesReportProps {
  startDate: Date;
  endDate: Date;
  data: {
    sales: { product: string; quantity: number; revenue: number }[];
    monthlySales: { month: string; revenue: number }[];
    topCustomers: { name: string; revenue: number }[];
  };
}

export default function SalesReport({ 
  startDate, 
  endDate, 
  data 
}: SalesReportProps) {
  const totalSales = data.sales.reduce((sum, item) => sum + item.revenue, 0);
  const totalQuantity = data.sales.reduce((sum, item) => sum + item.quantity, 0);
  const bestSellingProduct = data.sales.reduce(
    (max, item) => (item.quantity > max.quantity ? item : max),
    { product: "", quantity: 0, revenue: 0 }
  );
  
  // Handle export to Excel
  const handleExport = () => {
    const formattedData = formatSalesReportForExport(data, startDate, endDate);
    exportToExcel(formattedData, 'SalesReport');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Sales Report</CardTitle>
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
              <span className="text-lg font-bold text-green-600">${totalSales.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            
            <div className="grid gap-4 grid-cols-3">
              <div className="p-3 bg-muted rounded">
                <p className="text-sm text-muted-foreground">Total Items Sold</p>
                <p className="font-bold">{totalQuantity}</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="text-sm text-muted-foreground">Best Selling Product</p>
                <p className="font-medium">{bestSellingProduct.product}</p>
                <p className="text-sm">{bestSellingProduct.quantity} units</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="text-sm text-muted-foreground">Avg. Sale Value</p>
                <p className="font-medium">
                  ${(totalSales / data.sales.reduce((sum, item) => sum + 1, 0)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Products</h3>
            <Separator className="my-2" />
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Product</th>
                    <th className="text-right py-2">Quantity</th>
                    <th className="text-right py-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sales.map((item, index) => (
                    <tr key={index} className="border-b border-muted">
                      <td className="py-2">{item.product}</td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">${item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-medium">
                    <td className="py-2">Total</td>
                    <td className="text-right py-2">{totalQuantity}</td>
                    <td className="text-right py-2">${totalSales.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid gap-6 grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">Monthly Revenue</h3>
              <Separator className="my-2" />
              
              <div className="space-y-2">
                {data.monthlySales.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.month}</span>
                    <span>${item.revenue.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Top Customers</h3>
              <Separator className="my-2" />
              
              <div className="space-y-2">
                {data.topCustomers.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>${item.revenue.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
