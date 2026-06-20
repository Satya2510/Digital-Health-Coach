// COACH TAB — AI coach message thread (card-based)
// Shows all coach_messages for the current user, newest first.
// Each message card has tappable response options (where applicable).
// User taps a response → saved to coach_messages.response_chosen → coach
//   generates a follow-up message via Supabase Edge Function /coach-response.
// Loading dots shown while AI generates a response.

import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import CoachBubble from "@/components/coach/CoachBubble";
import ResponseOptions from "@/components/coach/ResponseOptions";
import LoadingDots from "@/components/shared/LoadingDots";

export default function CoachScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("coach_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setMessages(data ?? []);
    setLoading(false);

    await supabase
      .from("coach_messages")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
  }

  async function handleResponse(messageId: string, responseChosen: string) {
    setRespondingTo(messageId);
    await supabase
      .from("coach_messages")
      .update({ response_chosen: responseChosen })
      .eq("id", messageId);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/coach-response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ userId: user.id, messageId, responseChosen }),
    });

    setRespondingTo(null);
    if (res.ok) loadMessages();
  }

  if (loading) {
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
      <Text className="text-[22px] font-medium text-textPrimary mb-1">Your Coach</Text>
      <Text className="text-base text-textSecondary mb-6">Messages from your AI health coach</Text>

      {messages.length === 0 ? (
        <View className="bg-coachGreenBg rounded-xl p-5 mt-4">
          <Text className="text-base text-textPrimary">
            Complete your first check-in on the Home tab — your coach will respond here.
          </Text>
        </View>
      ) : (
        messages.map((msg) => (
          <View key={msg.id} className="mb-4">
            <CoachBubble
              message={msg.content}
              timestamp={msg.created_at}
              type={msg.message_type}
            />
            {msg.message_type === "checkin_48hr" && !msg.response_chosen && (
              respondingTo === msg.id ? (
                <View className="mt-3">
                  <LoadingDots />
                </View>
              ) : (
                <ResponseOptions
                  options={["Show me a lighter plan for this week", "Not ready yet — check in tomorrow", "Tell my coach what happened"]}
                  onSelect={(opt) => handleResponse(msg.id, opt)}
                />
              )
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}
