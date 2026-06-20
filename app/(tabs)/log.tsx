// LOG TAB — Holistic daily log: food + sleep + stress in one screen.
// Food: meal name + meal type (breakfast/lunch/dinner/snack) + is_healthy toggle
// Multiple food entries per day (add more button)
// Saves to food_logs table on submit.
// Shows today's logged meals below the form.

import { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import PrimaryButton from "@/components/shared/PrimaryButton";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;
type MealType = typeof MEAL_TYPES[number];

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [todayLogs, setTodayLogs] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTodayLogs();
  }, []);

  async function loadTodayLogs() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("food_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .order("created_at", { ascending: false });
    setTodayLogs(data ?? []);
  }

  async function handleSave() {
    if (!mealName.trim()) {
      setError("What did you eat?");
      return;
    }
    if (isHealthy === null) {
      setError("Mark it as healthy or not.");
      return;
    }
    setSaving(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("food_logs").insert({
        user_id: user.id,
        meal_name: mealName.trim(),
        meal_type: mealType,
        is_healthy: isHealthy,
        date: new Date().toISOString().split("T")[0],
      });
    }
    setMealName("");
    setIsHealthy(null);
    setSaving(false);
    loadTodayLogs();
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-[22px] font-medium text-textPrimary mb-1">Daily Log</Text>
        <Text className="text-base text-textSecondary mb-6">
          Log one meal at a time. No calorie counts.
        </Text>

        <View className="bg-card rounded-xl p-4 mb-6">
          <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-2">
            What did you eat?
          </Text>
          <TextInput
            className="border border-gray-200 rounded-lg px-4 py-3 text-base text-textPrimary mb-4"
            value={mealName}
            onChangeText={(t) => { setMealName(t); setError(""); }}
            placeholder="Dal chawal, salad, chai…"
            placeholderTextColor="#6B6B6B"
          />

          <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-3">
            Meal type
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {MEAL_TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setMealType(t)}
                className={`px-4 py-2 rounded-full border ${mealType === t ? "border-coachGreen bg-coachGreenBg" : "border-gray-200"}`}
              >
                <Text className={`text-sm font-medium capitalize ${mealType === t ? "text-coachGreen" : "text-textPrimary"}`}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-3">
            How do you feel about it?
          </Text>
          <View className="flex-row gap-3 mb-2">
            {[{ val: true, label: "Healthy choice ✓" }, { val: false, label: "Not my best 🤷" }].map((opt) => (
              <TouchableOpacity
                key={String(opt.val)}
                onPress={() => { setIsHealthy(opt.val); setError(""); }}
                className={`flex-1 py-3 rounded-xl border items-center ${isHealthy === opt.val ? "border-coachGreen bg-coachGreenBg" : "border-gray-200"}`}
              >
                <Text className={`text-sm font-medium ${isHealthy === opt.val ? "text-coachGreen" : "text-textSecondary"}`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error ? <Text className="text-sm text-comebackCoral mt-2 mb-2">{error}</Text> : null}
        </View>

        <PrimaryButton label="Log this meal" onPress={handleSave} loading={saving} />

        {todayLogs.length > 0 && (
          <View className="mt-8">
            <Text className="text-base font-medium text-textPrimary mb-3">
              Today's log
            </Text>
            {todayLogs.map((log) => (
              <View key={log.id} className="flex-row items-center bg-card rounded-xl p-3 mb-2">
                <Text className="text-base mr-2">{log.is_healthy ? "✅" : "🤷"}</Text>
                <View className="flex-1">
                  <Text className="text-base text-textPrimary">{log.meal_name}</Text>
                  <Text className="text-xs text-textSecondary capitalize">{log.meal_type}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
