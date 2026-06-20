// Comeback plan card — shown on Home tab when user returns after 5+ days away.
// Coral/warm background (#FAECE7). Language starts each item with "Just" or "Only".
// Replaces the standard daily check-in view for this session.

import { View, Text } from "react-native";

interface Plan {
  movement: string;
  food: string;
  sleep: string;
  encouragement: string;
}

interface Props {
  plan: Plan;
}

export default function ComebackPlan({ plan }: Props) {
  return (
    <View className="bg-comebackCoralBg rounded-xl p-5 border-l-4 border-comebackCoral">
      <Text className="text-xs font-medium uppercase tracking-widest text-comebackCoral mb-3">
        Welcome back — lighter plan for this week
      </Text>

      {[
        { emoji: "🏃", label: "Movement", value: plan.movement },
        { emoji: "🍱", label: "Food", value: plan.food },
        { emoji: "🌙", label: "Sleep", value: plan.sleep },
      ].map((item) => (
        <View key={item.label} className="flex-row items-start mb-3">
          <Text className="text-lg mr-3 mt-0.5">{item.emoji}</Text>
          <View className="flex-1">
            <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-0.5">
              {item.label}
            </Text>
            <Text className="text-base text-textPrimary">{item.value}</Text>
          </View>
        </View>
      ))}

      <Text className="text-sm text-textSecondary mt-1 italic">
        {plan.encouragement}
      </Text>
    </View>
  );
}
