import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";

const weeklyData = [
  { day: "Mon", steps: 6200 },
  { day: "Tue", steps: 8100 },
  { day: "Wed", steps: 7400 },
  { day: "Thu", steps: 9200 },
  { day: "Fri", steps: 6800 },
  { day: "Sat", steps: 7840 },
  { day: "Sun", steps: 0 },
];

const GOAL = 10000;

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-foreground">{payload[0].value.toLocaleString()} steps</p>
      {payload[0].value > 0 && (
        <p className="text-xs text-primary mt-0.5">{Math.round((payload[0].value / GOAL) * 100)}% of goal</p>
      )}
    </div>
  );
}

export function WeeklyActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={weeklyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="stepGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(173 80% 36%)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="hsl(173 80% 36%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12, fill: "hsl(215 16% 47%)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => v === 0 ? "" : `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={GOAL}
          stroke="hsl(215 16% 47%)"
          strokeDasharray="4 4"
          strokeWidth={1}
          label={{ value: "Goal", position: "insideTopRight", fontSize: 10, fill: "hsl(215 16% 47%)" }}
        />
        <Area
          type="monotone"
          dataKey="steps"
          stroke="hsl(173 80% 36%)"
          strokeWidth={2}
          fill="url(#stepGradient)"
          dot={{ fill: "hsl(173 80% 36%)", r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
