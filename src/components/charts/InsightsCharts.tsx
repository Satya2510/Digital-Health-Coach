import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const weightData = [
  { week: "W1", weight: 68.2 }, { week: "W2", weight: 67.9 },
  { week: "W3", weight: 67.5 }, { week: "W4", weight: 67.1 },
  { week: "W5", weight: 67.4 }, { week: "W6", weight: 66.8 },
  { week: "W7", weight: 66.5 }, { week: "W8", weight: 66.1 },
];

const sleepData = [
  { day: "Mon", hours: 7.2 }, { day: "Tue", hours: 6.5 },
  { day: "Wed", hours: 8.1 }, { day: "Thu", hours: 6.8 },
  { day: "Fri", hours: 7.5 }, { day: "Sat", hours: 8.4 },
  { day: "Sun", hours: 6.8 },
];

const calorieData = [
  { day: "Mon", consumed: 1720, burned: 2100 },
  { day: "Tue", consumed: 1850, burned: 2250 },
  { day: "Wed", consumed: 1640, burned: 2050 },
  { day: "Thu", consumed: 1900, burned: 2300 },
  { day: "Fri", consumed: 1780, burned: 2150 },
  { day: "Sat", consumed: 2100, burned: 2400 },
  { day: "Sun", consumed: 1640, burned: 2000 },
];

const tooltipStyle = "bg-card border border-border rounded-lg px-3 py-2 shadow-md text-sm";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className={tooltipStyle}>
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="text-xs">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function WeightTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={weightData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} domain={["dataMin - 0.5", "dataMax + 0.5"]} />
        <Tooltip content={<ChartTooltip />} />
        <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="hsl(173 80% 36%)" strokeWidth={2} dot={{ fill: "hsl(173 80% 36%)", r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SleepChart() {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={sleepData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} domain={[0, 10]} />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey="hours" name="Sleep (hrs)" fill="hsl(262 83% 58%)" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CalorieChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={calorieData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="consumed" name="Consumed" fill="hsl(173 80% 36%)" radius={[4, 4, 0, 0]} maxBarSize={20} />
        <Bar dataKey="burned" name="Burned" fill="hsl(221 83% 53%)" radius={[4, 4, 0, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
