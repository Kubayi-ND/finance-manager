
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";


export default function TopBar() {
  return (
    <header className="finance-header">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold ml-2">Finance Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
         
         
        </div>
      </div>
    </header>
  );
}
