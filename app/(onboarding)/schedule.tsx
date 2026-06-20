// ONBOARDING STEP 3: Schedule setup
// Captures: wake time, free window (morning / evening / flexible)
// Saved to profiles.wake_time and profiles.free_window.
// On complete: sets profiles.onboarded_at = now(), redirects to home tab.
// Progress indicator: step 3 of 3.

import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import PrimaryButton from "@/components/shared/PrimaryButton";

const WAKE_TIMES = ["Before 6am", "6–7am", "7–8am", "After 8am"];
const FREE_WINDOWS = [
  { key: "morning", label: "Morning" },
  { key: "evening", label: "Evening" },
  { key: "flexible", label: "Flexible" },
];

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const [wakeTime, setWakeTime] = useState<string | null>(null);
  const [freeWindow, setFreeWindow] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFinish() {
    if (!wakeTime || !freeWindow) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        wake_time: wakeTime,
        free_window: freeWindow,
        onboarded_at: new Date().toISOString(),
      }).eq("id", user.id);

      await supabase.from("activity_log").upsert({
        user_id: user.id,
        last_active_at: new Date().toISOString(),
      });
    }
    setLoading(false);
    router.replace("/(tabs)/home");
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24, paddingHorizontal: 24 }}
    >
      <View className="flex-row mb-8">
        {[1, 2, 3].map((step) => (
          <View key={step} className="h-1 flex-1 rounded-full mr-1 bg-coachGreen" />
        ))}
      </View>

      <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-2">
        Step 3 of 3
      </Text>
      <Text className="text-[22px] font-medium text-textPrimary mb-2">
        When do you usually wake up?
      </Text>
      <Text className="text-base text-textSecondary mb-6">
        Your coach will time messages to fit your day.
      </Text>

      <View className="flex-row flex-wrap gap-2 mb-8">
        {WAKE_TIMES.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setWakeTime(t)}
            className={`px-4 py-2 rounded-full border ${
              wakeTime === t ? "border-coachGreen bg-coachGreenBg" : "border-gray-200 bg-card"
            }`}
          >
            <Text className={`text-sm font-medium ${wakeTime === t ? "text-coachGreen" : "text-textPrimary"}`}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-[22px] font-medium text-textPrimary mb-2">
        When's your free window?
      </Text>
      <Text className="text-base text-textSecondary mb-6">
        When you'd have 10 minutes for yourself.
      </Text>

      <View className="gap-3 mb-10">
        {FREE_WINDOWS.map((w) => (
          <TouchableOpacity
            key={w.key}
            onPress={() => setFreeWindow(w.key)}
            className={`p-4 rounded-xl border ${
              freeWindow === w.key ? "border-coachGreen bg-coachGreenBg" : "border-gray-200 bg-card"
            }`}
          >
            <Text className={`text-base font-medium ${freeWindow === w.key ? "text-coachGreen" : "text-textPrimary"}`}>
              {w.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <PrimaryButton
        label="Start my plan"
        onPress={handleFinish}
        disabled={!wakeTime || !freeWindow}
        loading={loading}
      />
    </ScrollView>
  );
}
