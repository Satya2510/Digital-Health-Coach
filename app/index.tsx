// Splash screen — shown briefly on every app open.
// Checks Supabase session then redirects:
//   session + onboarded  → /(tabs)/home
//   session + not done   → /(onboarding)/goal
//   no session           → /(auth)/login
// Displays app logo and tagline while the session check runs.

import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function SplashScreen() {
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/(auth)/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded_at")
      .eq("id", session.user.id)
      .single();

    if (profile?.onboarded_at) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(onboarding)/goal");
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-[28px] font-semibold text-textPrimary mb-2">
        Health-First
      </Text>
      <Text className="text-base text-textSecondary mb-8">
        Your personal health coach
      </Text>
      <ActivityIndicator color="#1D9E75" />
    </View>
  );
}
