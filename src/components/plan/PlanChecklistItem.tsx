import * as Checkbox from "@radix-ui/react-checkbox";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanChecklistItemProps {
  label: string;
  time: string;
  completed: boolean;
  onToggle: () => void;
  category?: string;
}

export function PlanChecklistItem({ label, time, completed, onToggle, category }: PlanChecklistItemProps) {
  return (
    <motion.div
      layout
      className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
    >
      <Checkbox.Root
        checked={completed}
        onCheckedChange={onToggle}
        className={cn(
          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex-shrink-0",
          completed ? "bg-primary border-primary" : "border-border bg-background"
        )}
      >
        <Checkbox.Indicator>
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </Checkbox.Indicator>
      </Checkbox.Root>

      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium transition-colors",
          completed ? "line-through text-muted-foreground" : "text-foreground"
        )}>
          {label}
        </p>
        {category && (
          <p className="text-xs text-muted-foreground">{category}</p>
        )}
      </div>

      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md flex-shrink-0">
        {time}
      </span>
    </motion.div>
  );
}
