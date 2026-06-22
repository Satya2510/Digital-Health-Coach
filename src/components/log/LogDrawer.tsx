import { useState } from "react";
import { Drawer } from "vaul";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { X, Utensils, Droplets, Dumbbell, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type LogType = "food" | "water" | "workout" | "sleep";

const foodSchema = z.object({
  meal: z.string().min(1, "Meal name required"),
  calories: z.coerce.number().min(1).max(3000),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
});
const waterSchema = z.object({ amount: z.coerce.number().min(100).max(2000) });
const workoutSchema = z.object({
  activity: z.string().min(1, "Activity required"),
  duration: z.coerce.number().min(5).max(300),
  intensity: z.enum(["easy", "moderate", "hard"]),
});
const sleepSchema = z.object({
  bedtime: z.string().min(1),
  wakeTime: z.string().min(1),
});

const TYPE_META: Record<LogType, { icon: any; label: string; color: string }> = {
  food:    { icon: Utensils,   label: "Log a meal",     color: "text-orange-500" },
  water:   { icon: Droplets,   label: "Log water",      color: "text-blue-500" },
  workout: { icon: Dumbbell,   label: "Log workout",    color: "text-primary" },
  sleep:   { icon: Moon,       label: "Log sleep",      color: "text-indigo-500" },
};

function MealTypeButton({ value, current, onClick }: { value: string; current: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors capitalize",
        current === value ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:bg-muted"
      )}
    >
      {value}
    </button>
  );
}

interface LogDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: LogType;
}

export function LogDrawer({ open, onOpenChange, type }: LogDrawerProps) {
  const meta = TYPE_META[type];
  const Icon = meta.icon;
  const [waterAmount, setWaterAmount] = useState(500);
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch");
  const [intensity, setIntensity] = useState<"easy" | "moderate" | "hard">("moderate");

  const foodForm = useForm({ resolver: zodResolver(foodSchema), defaultValues: { meal: "", calories: 0 } });
  const workoutForm = useForm({ resolver: zodResolver(workoutSchema), defaultValues: { activity: "", duration: 30 } });
  const sleepForm = useForm({ resolver: zodResolver(sleepSchema), defaultValues: { bedtime: "22:30", wakeTime: "06:30" } });

  const handleSubmit = () => {
    const labels: Record<LogType, string> = {
      food: "Meal logged successfully! 🍽️",
      water: `${waterAmount}ml water logged! 💧`,
      workout: "Workout logged! Great work! 💪",
      sleep: "Sleep logged! 😴",
    };
    toast.success(labels[type]);
    onOpenChange(false);
  };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl border border-border max-h-[85vh] flex flex-col">
          <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <Icon className={cn("w-5 h-5", meta.color)} />
              <h2 className="text-base font-semibold">{meta.label}</h2>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {type === "food" && (
              <>
                <div>
                  <Label htmlFor="meal" className="text-sm mb-1.5 block">Meal name</Label>
                  <Input id="meal" placeholder="e.g. Grilled chicken salad" {...foodForm.register("meal")} />
                  {foodForm.formState.errors.meal && <p className="text-xs text-destructive mt-1">{foodForm.formState.errors.meal.message}</p>}
                </div>
                <div>
                  <Label htmlFor="cals" className="text-sm mb-1.5 block">Calories</Label>
                  <Input id="cals" type="number" placeholder="e.g. 450" {...foodForm.register("calories")} />
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Meal type</Label>
                  <div className="flex gap-2">
                    {(["breakfast", "lunch", "dinner", "snack"] as const).map(t => (
                      <MealTypeButton key={t} value={t} current={mealType} onClick={() => setMealType(t)} />
                    ))}
                  </div>
                </div>
              </>
            )}

            {type === "water" && (
              <div>
                <Label className="text-sm mb-4 block">Amount</Label>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-primary">{waterAmount}</span>
                  <span className="text-lg text-muted-foreground ml-1">ml</span>
                </div>
                <input
                  type="range" min={100} max={1000} step={50}
                  value={waterAmount}
                  onChange={e => setWaterAmount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>100ml</span><span>1000ml</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[150, 250, 350, 500].map(v => (
                    <button key={v} type="button" onClick={() => setWaterAmount(v)}
                      className={cn("py-1.5 text-xs rounded-lg border transition-colors", waterAmount === v ? "bg-primary text-white border-primary" : "border-border text-muted-foreground")}
                    >{v}ml</button>
                  ))}
                </div>
              </div>
            )}

            {type === "workout" && (
              <>
                <div>
                  <Label htmlFor="activity" className="text-sm mb-1.5 block">Activity</Label>
                  <Input id="activity" placeholder="e.g. Evening run" {...workoutForm.register("activity")} />
                </div>
                <div>
                  <Label htmlFor="duration" className="text-sm mb-1.5 block">Duration (minutes)</Label>
                  <Input id="duration" type="number" placeholder="30" {...workoutForm.register("duration")} />
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Intensity</Label>
                  <div className="flex gap-2">
                    {(["easy", "moderate", "hard"] as const).map(i => (
                      <MealTypeButton key={i} value={i} current={intensity} onClick={() => setIntensity(i)} />
                    ))}
                  </div>
                </div>
              </>
            )}

            {type === "sleep" && (
              <>
                <div>
                  <Label htmlFor="bedtime" className="text-sm mb-1.5 block">Bedtime</Label>
                  <Input id="bedtime" type="time" {...sleepForm.register("bedtime")} />
                </div>
                <div>
                  <Label htmlFor="wake" className="text-sm mb-1.5 block">Wake time</Label>
                  <Input id="wake" type="time" {...sleepForm.register("wakeTime")} />
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Sleep quality</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" className="flex-1 py-2 text-lg rounded-lg border border-border hover:bg-muted transition-colors">
                        {["😫", "😴", "😐", "😊", "🌟"][s - 1]}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="px-5 pb-6 pt-3 border-t border-border flex-shrink-0">
            <Button className="w-full h-11 rounded-xl text-base" onClick={handleSubmit}>
              Save entry
            </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
