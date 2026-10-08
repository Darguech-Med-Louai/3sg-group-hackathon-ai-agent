import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  suffix?: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  className?: string;
  delay?: number;
}

export function KPICard({
  title,
  value,
  suffix = "",
  icon: Icon,
  trend,
  trendLabel,
  className,
  delay = 0,
}: KPICardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 group",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight">{value}</span>
              {suffix && (
                <span className="text-sm text-muted-foreground font-medium">
                  {suffix}
                </span>
              )}
            </div>
            {trend !== undefined && (
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                ) : isNegative ? (
                  <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                ) : null}
                <span
                  className={cn(
                    "text-xs font-medium",
                    isPositive
                      ? "text-emerald-500"
                      : isNegative
                        ? "text-red-400"
                        : "text-muted-foreground"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {trend}%
                  {trendLabel && (
                    <span className="text-muted-foreground ml-1">
                      {trendLabel}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
      {/* Subtle gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}
