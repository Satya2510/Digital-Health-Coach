// HOME TAB — Daily check-in + today's coach message
// On mount:
//   1. Update activity_log.last_active_at for the current user
//   2. Check if gap > 5 days → show ComebackPlan instead of normal home
//   3. Check if today's check-in already submitted → show read-only state
//   4. Load today's coach message from coach_messages table
// Three-tap check-in: sleep quality, energy level, stress level (1/2/3)
// On check-in submit: calls Supabase Edge Function /coach-message → inserts message

import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import DailyCheckin from "@/components/home/DailyCheckin";
import TodayCard from "@/components/home/TodayCard";
import CoachBubble from "@/components/coach/CoachBubble";
import ComebackPlan from "@/components/coach/ComebackPlan";
import LoadingDots from "@/components/shared/LoadingDots";
import { getDaysSince } from "@/lib/utils";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<any>(null);
  const [checkin, setCheckin] = useState<any>(null);
  const [coachMessage, setCoachMessage] = useState<string | null>(null);
  const [comebackPlan, setComebackPlan] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    initHome();
  }, []);

  async function initHome() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: prof }, { data: activity }, { data: todayCheckin }, { data: latestMessage }] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("activity_log").select("last_active_at").eq("user_id", user.id).single(),
        supabase.from("checkins").select("*").eq("user_id", user.id).eq("date", new Date().toISOString().split("T")[0]).single(),
        supabase.from("coach_messages").select("content").eq("user_id", user.id).eq("message_type", "daily").order("created_at", { ascending: false }).limit(1).single(),
      ]);

    setProfile(prof);
    setCheckin(todayCheckin);
    if (latestMessage) setCoachMessage(latestMessage.content);

    const daysSince = activity?.last_active_at ? getDaysSince(activity.last_active_at) : 0;

    if (daysSince > 5) {
      await fetchComebackPlan(user.id, prof, daysSince);
    }

    await supabase.from("activity_log").upsert({ user_id: user.id, last_active_at: new Date().toISOString() });
    setPageLoading(false);
  }

  async function fetchComebackPlan(userId: string, prof: any, daysSince: number) {
    const { data: activePlan } = await supabase.from("plans").select("*").eq("user_id", userId).eq("is_active", true).single();
    const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/comeback-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ userId, name: prof?.name, daysSince, originalPlan: activePlan }),
    });
    if (res.ok) {
      const plan = await res.json();
      setComebackPlan(plan);
    }
  }

  async function handleCheckinSubmit(sleep: number, energy: number, stress: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("checkins").upsert({
      user_id: user.id,
      date: new Date().toISOString().split("T")[0],
      sleep_quality: sleep,
      energy_level: energy,
      stress_level: stress,
    });
    setCheckin({ sleep_quality: sleep, energy_level: energy, stress_level: stress });

    setLoadingMessage(true);
    const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/coach-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ userId: user.id, sleep, energy, stress, goal: profile?.goal }),
    });
    if (res.ok) {
      const { message } = await res.json();
      setCoachMessage(message);
    }
    setLoadingMessage(false);
  }

  if (pageLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#1D9E75" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: 16 }}
    >
      <Text className="text-[22px] font-medium text-textPrimary mb-1">
        Good morning{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}
      </Text>
      <Text className="text-base text-textSecondary mb-6">
        {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
      </Text>

      {comebackPlan ? (
        <ComebackPlan plan={comebackPlan} />
      ) : (
        <>
          {!checkin ? (
            <DailyCheckin onSubmit={handleCheckinSubmit} />
          ) : (
            <TodayCard checkin={checkin} />
          )}

          {loadingMessage && (
            <View className="mt-6">
              <LoadingDots />
            </View>
          )}

          {coachMessage && !loadingMessage && (
            <View className="mt-6">
              <CoachBubble message={coachMessage} />
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}
