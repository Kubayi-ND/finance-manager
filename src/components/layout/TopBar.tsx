import { NavLink } from "react-router-dom";
import { LogIn } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export default function TopBar() {
  return (
    <header className="finance-header">
      <div className="h-16 px-1 flex items-center justify-between">
        <div className="flex items-center">
          <SidebarTrigger />
          <h1 className="text-sm md:text-xl font-semibold ml-2">Finance Management</h1>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 justify-end">
          <ThemeToggle />
        </div > 
        <div className="flex items-center gap-2">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-2 rounded-md",
                isActive ? "text-primary font-medium" : "text-foreground"
              )
            }
          >
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </NavLink>
        </div>
        </div>
        
      </div>
    </header>
  );
}
