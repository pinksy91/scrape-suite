import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend, className = "" }: StatCardProps) {
  return (
    <Card className={`p-6 bg-gradient-surface border-card-border hover:shadow-medium transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
            <Icon className="w-4 h-4" />
            {title}
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
        </div>
        
        {trend && (
          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
            trend.isPositive 
              ? "text-success bg-success/10" 
              : "text-destructive bg-destructive/10"
          }`}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </div>
        )}
      </div>
    </Card>
  );
}