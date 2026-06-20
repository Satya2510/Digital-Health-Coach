// ONBOARDING STEP 2: Past failure acknowledgement
// Asks: "Have you tried a health app or plan before?"
// If yes: "What usually gets in the way?" (open text, optional)
// This is not a shame exercise — it's context for the AI coach.
// Saved to profiles.past_failure_reason.
// Progress indicator: step 2 of 3.

import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import PrimaryButton from "@/components/shared/PrimaryButton";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [tried, setTried] = useState<boolean | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        past_failure_reason: tried ? reason || "Tried before but stopped" : "First time",
      }).eq("id", user.id);
    }
    setLoading(false);
    router.push("/(onboarding)/schedule");
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24, paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row mb-8">
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              className={`h-1 flex-1 rounded-full mr-1 ${step <= 2 ? "bg-coachGreen" : "bg-gray-200"}`}
            />
          ))}
        </View>

        <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-2">
          Step 2 of 3
        </Text>
        <Text className="text-[22px] font-medium text-textPrimary mb-2">
          Have you tried a health app before?
        </Text>
        <Text className="text-base text-textSecondary mb-8">
          No judgment — this helps your coach understand you better.
        </Text>

        <View className="gap-3 mb-6">
          {[
            { value: true, label: "Yes, I have" },
            { value: false, label: "No, this is my first time" },
          ].map((opt) => (
            <TouchableOpacity
              key={String(opt.value)}
              onPress={() => setTried(opt.value)}
              className={`p-4 rounded-xl border ${
                tried === opt.value
                  ? "border-coachGreen bg-coachGreenBg"
                  : "border-gray-200 bg-card"
              }`}
            >
              <Text className={`text-base font-medium ${tried === opt.value ? "text-coachGreen" : "text-textPrimary"}`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tried === true && (
          <View className="mb-6">
            <Text className="text-base text-textSecondary mb-3">
              What usually gets in the way? (optional)
            </Text>
            <TextInput
              className="bg-card border border-gray-200 rounded-xl px-4 py-3 text-base text-textPrimary"
              value={reason}
              onChangeText={setReason}
              placeholder="Busy schedule, lost motivation…"
              placeholderTextColor="#6B6B6B"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        )}

        <PrimaryButton
          label="Next"
          onPress={handleNext}
          disabled={tried === null}
          loading={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
