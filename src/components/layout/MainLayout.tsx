
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="finance-layout w-full">
          <AppSidebar />
          <div className="finance-main w-full">
            <TopBar />
            <main className="finance-content w-full">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
