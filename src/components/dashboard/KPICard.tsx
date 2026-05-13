import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default' 
}: KPICardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          cardClass: "border-success/20 bg-gradient-to-br from-success/5 to-success/10",
          iconClass: "text-success-foreground bg-gradient-success",
          valueClass: "text-success"
        };
      case 'warning':
        return {
          cardClass: "border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10",
          iconClass: "text-warning-foreground bg-gradient-warning",
          valueClass: "text-warning"
        };
      case 'destructive':
        return {
          cardClass: "border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10",
          iconClass: "text-destructive-foreground bg-gradient-danger",
          valueClass: "text-destructive"
        };
      default:
        return {
          cardClass: "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10",
          iconClass: "text-primary-foreground bg-gradient-primary",
          valueClass: "text-primary"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className={`shadow-corporate hover:shadow-elevated transition-all duration-300 ${styles.cardClass}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${styles.iconClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div>
            <div className={`text-2xl font-bold ${styles.valueClass}`}>
              {value}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {trend && (
            <Badge 
              variant={trend.isPositive ? "default" : "destructive"}
              className="text-xs"
            >
              {trend.isPositive ? "+" : ""}{trend.value}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}