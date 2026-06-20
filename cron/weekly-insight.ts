// Weekly insight generator — runs every Sunday.
// For each user with 4+ check-ins this week, calls Claude to generate a holistic insight.
// Inserts result into coach_messages (type: 'insight').

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function runWeeklyInsight() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const { data: activeUsers } = await supabase
    .from("checkins")
    .select("user_id")
    .gte("date", sevenDaysAgo);

  if (!activeUsers) return;

  const uniqueUserIds = [...new Set(activeUsers.map((r) => r.user_id))];
  console.log(`Generating weekly insights for ${uniqueUserIds.length} users...`);

  for (const userId of uniqueUserIds) {
    try {
      await generateInsightForUser(userId, sevenDaysAgo);
    } catch (err) {
      console.error(`Failed insight for user ${userId}:`, err);
    }
  }
}

async function generateInsightForUser(userId: string, since: string) {
  const [{ data: checkins }, { data: foodLogs }] = await Promise.all([
    supabase.from("checkins").select("date,sleep_quality,energy_level,stress_level").eq("user_id", userId).gte("date", since),
    supabase.from("food_logs").select("date,meal_type,is_healthy").eq("user_id", userId).gte("date", since),
  ]);

  if (!checkins || checkins.length < 4) return;

  const prompt = `Analyse this user's week.
Check-ins: ${JSON.stringify(checkins)}
Food logs: ${JSON.stringify(foodLogs ?? [])}
Find ONE meaningful cross-domain pattern.
Return JSON only:
{
  "has_insight": true,
  "title": "5 words max, observation not advice",
  "body": "2 sentences: what the data shows + what it means",
  "recommendation": "one specific, small action for next week"
}
If no clear pattern, return { "has_insight": false }. No extra text.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const insight = JSON.parse((response.content[0] as any).text.trim());
  if (!insight.has_insight) return;

  await supabase.from("coach_messages").insert({
    user_id: userId,
    message_type: "insight",
    content: JSON.stringify(insight),
  });

  console.log(`Insight generated for user ${userId}`);
}
