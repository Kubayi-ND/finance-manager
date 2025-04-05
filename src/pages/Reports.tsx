
import { useState } from "react";
import { z } from "zod";
import ReportForm from "@/components/reports/ReportForm";
import IncomeStatement from "@/components/reports/IncomeStatement";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Mock data for the income statement
const mockReportData = {
  revenues: [
    { category: "Product Sales", amount: 25000 },
    { category: "Services", amount: 15000 },
    { category: "Investments", amount: 2000 },
  ],
  expenses: [
    { category: "Salaries", amount: 12000 },
    { category: "Rent", amount: 2000 },
    { category: "Utilities", amount: 1000 },
    { category: "Marketing", amount: 1500 },
    { category: "Office Supplies", amount: 500 },
    { category: "Software", amount: 750 },
  ],
};

const reportSchema = z.object({
  reportType: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

export default function Reports() {
  const [reportData, setReportData] = useState<z.infer<typeof reportSchema> | null>(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateReport = (data: z.infer<typeof reportSchema>) => {
    // Check if dates are valid
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (data.startDate >= today || data.endDate >= today) {
      setError("Invalid time selection. Report dates must be in the past.");
      setReportGenerated(false);
      return;
    }
    
    // Clear any previous errors
    setError("");
    
    // Set the report data
    setReportData(data);
    setReportGenerated(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <ReportForm onGenerate={handleGenerateReport} />
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <div>
          {reportGenerated && reportData && (
            reportData.reportType === "income-statement" ? (
              <IncomeStatement 
                startDate={reportData.startDate} 
                endDate={reportData.endDate} 
                data={mockReportData} 
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  {reportData.reportType.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} 
                  report is being generated...
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
