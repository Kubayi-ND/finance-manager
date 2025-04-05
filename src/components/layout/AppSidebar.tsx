
import { NavLink } from "react-router-dom";
import {
  BarChartBig,
  LayoutDashboard,
  Receipt,
  Wallet,
  FileText,
  Settings,
  DollarSign,
  Package
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 font-semibold text-xl">
        FinFlow <span className="text-primary">Nexus</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2",
                        isActive ? "text-primary font-medium" : "text-foreground"
                      )
                    }
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2",
                        isActive ? "text-primary font-medium" : "text-foreground"
                      )
                    }
                  >
                    <BarChartBig className="h-5 w-5" />
                    <span>Reports</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Transactions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/supplier-invoices"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2",
                        isActive ? "text-primary font-medium" : "text-foreground"
                      )
                    }
                  >
                    <Package className="h-5 w-5" />
                    <span>Supplier Invoices</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/customer-invoices"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2",
                        isActive ? "text-primary font-medium" : "text-foreground"
                      )
                    }
                  >
                    <Receipt className="h-5 w-5" />
                    <span>Customer Invoices</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/expenses"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2",
                        isActive ? "text-primary font-medium" : "text-foreground"
                      )
                    }
                  >
                    <Wallet className="h-5 w-5" />
                    <span>Expenses</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/income"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2",
                        isActive ? "text-primary font-medium" : "text-foreground"
                      )
                    }
                  >
                    <DollarSign className="h-5 w-5" />
                    <span>Income</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-2",
                    isActive ? "text-primary font-medium" : "text-foreground"
                  )
                }
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
