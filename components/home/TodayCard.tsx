// Shown on Home tab after check-in is already submitted for today.
// Displays a summary of today's check-in values as a read-only card.

import { View, Text } from "react-native";

const SLEEP_LABELS = ["", "Poor", "Okay", "Good"];
const ENERGY_LABELS = ["", "Low", "Medium", "High"];
const STRESS_LABELS = ["", "Calm", "Some stress", "High stress"];

interface Props {
  checkin: {
    sleep_quality: number;
    energy_level: number;
    stress_level: number;
  };
}

export default function TodayCard({ checkin }: Props) {
  return (
    <View className="bg-card rounded-xl p-4">
      <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-3">
        Today's check-in
      </Text>
      <View className="flex-row justify-between">
        {[
          { label: "Sleep", value: SLEEP_LABELS[checkin.sleep_quality] },
          { label: "Energy", value: ENERGY_LABELS[checkin.energy_level] },
          { label: "Stress", value: STRESS_LABELS[checkin.stress_level] },
        ].map((item) => (
          <View key={item.label} className="flex-1 items-center">
            <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-1">
              {item.label}
            </Text>
            <Text className="text-base font-medium text-textPrimary">{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
