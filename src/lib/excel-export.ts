import * as XLSX from 'xlsx';
import { format } from 'date-fns';

/**
 * Export data to Excel file
 * 
 * @param data The data to be exported
 * @param fileName The name of the exported file
 * @param sheetName The name of the sheet in the Excel file
 */
export function exportToExcel(data: any[], fileName: string, sheetName: string = 'Sheet1'): void {
  // Create a worksheet from the data
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Create a workbook with the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generate the file with timestamp to make it unique
  const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
  const fullFileName = `${fileName}_${timestamp}.xlsx`;
  
  // Trigger the file download
  XLSX.writeFile(workbook, fullFileName);
}

/**
 * Format data for Income Statement export
 */
export function formatIncomeStatementForExport(data: {
  revenues: { category: string; amount: number }[];
  expenses: { category: string; amount: number }[];
}, startDate: Date, endDate: Date) {
  const formattedData = [];
  
  // Add header
  formattedData.push({
    'Category': 'INCOME STATEMENT',
    'Amount': `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
  });
  formattedData.push({ 'Category': '', 'Amount': '' }); // Empty row
  
  // Add revenue section
  formattedData.push({ 'Category': 'REVENUE', 'Amount': '' });
  data.revenues.forEach(item => {
    formattedData.push({
      'Category': item.category,
      'Amount': item.amount.toFixed(2)
    });
  });
  
  // Add revenue total
  const totalRevenue = data.revenues.reduce((sum, item) => sum + item.amount, 0);
  formattedData.push({
    'Category': 'Total Revenue',
    'Amount': totalRevenue.toFixed(2)
  });
  formattedData.push({ 'Category': '', 'Amount': '' }); // Empty row
  
  // Add expense section
  formattedData.push({ 'Category': 'EXPENSES', 'Amount': '' });
  data.expenses.forEach(item => {
    formattedData.push({
      'Category': item.category,
      'Amount': item.amount.toFixed(2)
    });
  });
  
  // Add expense total
  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  formattedData.push({
    'Category': 'Total Expenses',
    'Amount': totalExpenses.toFixed(2)
  });
  formattedData.push({ 'Category': '', 'Amount': '' }); // Empty row
  
  // Add net profit
  const netProfit = totalRevenue - totalExpenses;
  formattedData.push({
    'Category': 'NET PROFIT',
    'Amount': netProfit.toFixed(2)
  });
  
  return formattedData;
}

/**
 * Format data for Expense Report export
 */
export function formatExpenseReportForExport(data: {
  expenses: { category: string; amount: number }[];
  monthlyTrend: { month: string; amount: number }[];
}, startDate: Date, endDate: Date) {
  const formattedData = [];
  
  // Add header
  formattedData.push({
    'Category': 'EXPENSE REPORT',
    'Amount': `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
  });
  formattedData.push({ 'Category': '', 'Amount': '' }); // Empty row
  
  // Add expense categories
  formattedData.push({ 'Category': 'EXPENSE CATEGORIES', 'Amount': '' });
  data.expenses.forEach(item => {
    formattedData.push({
      'Category': item.category,
      'Amount': item.amount.toFixed(2)
    });
  });
  
  // Add total
  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  formattedData.push({
    'Category': 'Total Expenses',
    'Amount': totalExpenses.toFixed(2)
  });
  formattedData.push({ 'Category': '', 'Amount': '' }); // Empty row
  
  // Add monthly trend
  formattedData.push({ 'Month': 'MONTHLY TREND', 'Amount': '' });
  data.monthlyTrend.forEach(item => {
    formattedData.push({
      'Month': item.month,
      'Amount': item.amount.toFixed(2)
    });
  });
  
  return formattedData;
}

/**
 * Format data for Sales Report export
 */
export function formatSalesReportForExport(data: {
  sales: { product: string; quantity: number; revenue: number }[];
  monthlySales: { month: string; revenue: number }[];
  topCustomers: { name: string; revenue: number }[];
}, startDate: Date, endDate: Date) {
  const formattedData = [];
  
  // Add header
  formattedData.push({
    'Item': 'SALES REPORT',
    'Quantity': '',
    'Revenue': `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
  });
  formattedData.push({ 'Item': '', 'Quantity': '', 'Revenue': '' }); // Empty row
  
  // Add product sales
  formattedData.push({ 'Item': 'PRODUCT SALES', 'Quantity': '', 'Revenue': '' });
  data.sales.forEach(item => {
    formattedData.push({
      'Item': item.product,
      'Quantity': item.quantity,
      'Revenue': item.revenue.toFixed(2)
    });
  });
  
  // Add total
  const totalQuantity = data.sales.reduce((sum, item) => sum + item.quantity, 0);
  const totalRevenue = data.sales.reduce((sum, item) => sum + item.revenue, 0);
  formattedData.push({
    'Item': 'Total',
    'Quantity': totalQuantity,
    'Revenue': totalRevenue.toFixed(2)
  });
  formattedData.push({ 'Item': '', 'Quantity': '', 'Revenue': '' }); // Empty row
  
  // Add monthly sales
  formattedData.push({ 'Month': 'MONTHLY SALES', 'Revenue': '' });
  data.monthlySales.forEach(item => {
    formattedData.push({
      'Month': item.month,
      'Revenue': item.revenue.toFixed(2)
    });
  });
  formattedData.push({ 'Month': '', 'Revenue': '' }); // Empty row
  
  // Add top customers
  formattedData.push({ 'Customer': 'TOP CUSTOMERS', 'Revenue': '' });
  data.topCustomers.forEach(item => {
    formattedData.push({
      'Customer': item.name,
      'Revenue': item.revenue.toFixed(2)
    });
  });
  
  return formattedData;
}
