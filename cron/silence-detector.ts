// Silence detector — finds users inactive for 48+ hours and sends a check-in message.
// Skips users who already received a checkin_48hr message in the last 48 hours.
// For each inactive user:
//   1. Calls Claude API with silence check-in prompt
//   2. Inserts message into coach_messages
//   3. Sends Expo push notification (if token exists)

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function runSilenceDetector() {
  const { data: inactiveUsers, error } = await supabase.rpc("get_inactive_users");

  if (error) {
    console.error("Failed to fetch inactive users:", error.message);
    return;
  }

  if (!inactiveUsers || inactiveUsers.length === 0) {
    console.log("No inactive users found.");
    return;
  }

  console.log(`Processing ${inactiveUsers.length} inactive users...`);

  for (const user of inactiveUsers) {
    try {
      await processInactiveUser(user);
    } catch (err) {
      console.error(`Failed to process user ${user.id}:`, err);
    }
  }
}

async function processInactiveUser(user: any) {
  const daysSince = Math.floor(
    (Date.now() - new Date(user.last_active_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  const prompt = `You are a caring health coach. The user ${user.name ?? "there"} has not opened the app in ${daysSince} days.
Their last check-in: sleep=${user.sleep ?? "unknown"}/3, energy=${user.energy ?? "unknown"}/3, stress=${user.stress ?? "unknown"}/3.
Write a warm, short check-in message (3 sentences max).
Do NOT mention: streaks, missed days count, failure, disappointment.
Sentence 1: acknowledge that life gets busy, no judgment.
Sentence 2: let them know you're here when they're ready.
Sentence 3: offer one of three paths forward.
Then provide exactly these 3 response options as a JSON array:
["Show me a lighter plan for this week", "Not ready yet — check in tomorrow", "Tell my coach what happened"]
Return as JSON only: { "message": "...", "options": [...] }`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const result = JSON.parse((response.content[0] as any).text.trim());

  await supabase.from("coach_messages").insert({
    user_id: user.id,
    message_type: "checkin_48hr",
    content: result.message,
  });

  if (user.expo_push_token) {
    await sendPushNotification(user.expo_push_token, result.message);
  }

  console.log(`Sent check-in to user ${user.id}`);
}

async function sendPushNotification(token: string, message: string) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: token,
      title: "Your coach is thinking of you",
      body: message.slice(0, 100),
      data: { screen: "coach" },
    }),
  });
}
