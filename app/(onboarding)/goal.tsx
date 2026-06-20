// ONBOARDING STEP 1: Goal selection
// User picks one primary health goal:
//   - Weight loss
//   - More energy
//   - Better sleep
//   - Stress management
// Saved to profiles.goal on "Next" tap.
// Progress indicator: step 1 of 3.

import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import PrimaryButton from "@/components/shared/PrimaryButton";

const GOALS = [
  { key: "weight_loss", label: "Lose weight", emoji: "⚖️" },
  { key: "energy", label: "More energy", emoji: "⚡" },
  { key: "sleep", label: "Sleep better", emoji: "🌙" },
  { key: "stress", label: "Manage stress", emoji: "🧘" },
] as const;

export default function GoalScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (!selected) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ goal: selected }).eq("id", user.id);
    }
    setLoading(false);
    router.push("/(onboarding)/history");
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24, paddingHorizontal: 24 }}
    >
      <View className="flex-row mb-8">
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            className={`h-1 flex-1 rounded-full mr-1 ${step === 1 ? "bg-coachGreen" : "bg-gray-200"}`}
          />
        ))}
      </View>

      <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-2">
        Step 1 of 3
      </Text>
      <Text className="text-[22px] font-medium text-textPrimary mb-2">
        What's your main goal?
      </Text>
      <Text className="text-base text-textSecondary mb-8">
        We'll build your plan around this.
      </Text>

      <View className="gap-3 mb-10">
        {GOALS.map((goal) => (
          <TouchableOpacity
            key={goal.key}
            onPress={() => setSelected(goal.key)}
            className={`flex-row items-center p-4 rounded-xl border ${
              selected === goal.key
                ? "border-coachGreen bg-coachGreenBg"
                : "border-gray-200 bg-card"
            }`}
          >
            <Text className="text-2xl mr-3">{goal.emoji}</Text>
            <Text className={`text-base font-medium ${selected === goal.key ? "text-coachGreen" : "text-textPrimary"}`}>
              {goal.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <PrimaryButton
        label="Next"
        onPress={handleNext}
        disabled={!selected}
        loading={loading}
      />
    </ScrollView>
  );
}
