export interface HealthMetric {
  id: string;
  label: string;
  value: number;
  goal: number;
  unit: string;
  delta: number;
  deltaLabel: string;
}

export interface LogEntry {
  id: string;
  type: "food" | "water" | "workout" | "sleep";
  timestamp: Date;
  data: Record<string, unknown>;
}

export interface PlanItem {
  id: string;
  label: string;
  time: string;
  completed: boolean;
  category: "workout" | "meal" | "rest" | "mindfulness";
}

export interface WeeklyData {
  day: string;
  steps: number;
  calories: number;
  sleep: number;
}

export interface UserProfile {
  name: string;
  age: number;
  goal: string;
  avatarInitials: string;
}

export interface CoachMessage {
  id: string;
  role: "coach" | "user";
  content: string;
  timestamp: Date;
}
