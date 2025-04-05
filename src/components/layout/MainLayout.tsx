
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
        <div className="finance-layout">
          <AppSidebar />
          <div className="finance-main">
            <TopBar />
            <main className="finance-content">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
