// Green coach message card — used on Home tab and Coach tab.
// Background: #E1F5EE (coachGreenBg). Left border accent in coach green.
// Optional timestamp and message type label.

import { View, Text } from "react-native";

interface Props {
  message: string;
  timestamp?: string;
  type?: string;
}

const TYPE_LABELS: Record<string, string> = {
  daily: "Today's message",
  checkin_48hr: "Checking in on you",
  comeback: "Welcome back",
  insight: "Weekly insight",
};

export default function CoachBubble({ message, timestamp, type }: Props) {
  return (
    <View className="bg-coachGreenBg rounded-xl p-4 border-l-4 border-coachGreen">
      {type && (
        <Text className="text-xs font-medium uppercase tracking-widest text-coachGreen mb-2">
          {TYPE_LABELS[type] ?? type}
        </Text>
      )}
      <Text className="text-base text-textPrimary leading-6">{message}</Text>
      {timestamp && (
        <Text className="text-xs text-textSecondary mt-2">
          {new Date(timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </Text>
      )}
    </View>
  );
}
