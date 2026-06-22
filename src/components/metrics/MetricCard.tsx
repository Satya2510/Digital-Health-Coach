import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  unit: string;
  progress: number;
  delta: string;
  deltaVariant: "success" | "warning" | "danger" | "muted";
  index?: number;
}

export function MetricCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  unit,
  progress,
  delta,
  deltaVariant,
  index = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
    >
      <Card className="cursor-default hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", iconBg)}>
                <Icon className={cn("w-4 h-4", iconColor)} />
              </div>
              <span className="text-sm text-muted-foreground font-medium">{label}</span>
            </div>
            <Badge variant={deltaVariant} className="text-xs">{delta}</Badge>
          </div>
          <div className="mb-3">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            <span className="text-sm text-muted-foreground ml-1.5">{unit}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1.5 text-right">{progress}% of goal</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
