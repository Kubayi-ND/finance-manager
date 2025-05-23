
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import SupplierInvoices from "./pages/SupplierInvoices";
import CustomerInvoices from "./pages/CustomerInvoices";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/supplier-invoices" element={
            <MainLayout>
              <SupplierInvoices />
            </MainLayout>
          } />
          <Route path="/customer-invoices" element={
            <MainLayout>
              <CustomerInvoices />
            </MainLayout>
          } />
          <Route path="/expenses" element={
            <MainLayout>
              <Expenses />
            </MainLayout>
          } />
          <Route path="/income" element={
            <MainLayout>
              <Income />
            </MainLayout>
          } />
          <Route path="/reports" element={
            <MainLayout>
              <Reports />
            </MainLayout>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
