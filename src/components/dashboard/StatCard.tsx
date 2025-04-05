
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
  trend?: number;
  className?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>
        {Icon && (
          <div className="rounded-full p-2 bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="stat-value">{value}</p>
        {description && <p className="stat-description">{description}</p>}
      </div>
      {trend !== undefined && (
        <div
          className={cn(
            "text-xs font-medium inline-flex items-center px-2 py-1 rounded-full",
            trend >= 0
              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          )}
        >
          {trend >= 0 ? "+" : ""}
          {trend}%
        </div>
      )}
    </div>
  );
}
