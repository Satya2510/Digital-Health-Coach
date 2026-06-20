// Supabase Edge Function: /insight
// Called from Progress tab when user has 4+ days of data.
// Fetches last 7 days of checkins + food_logs, calls Claude for cross-domain pattern.
// Inserts result into coach_messages (type: 'insight').
// Returns the insight object.

import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { userId } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [{ data: checkins }, { data: foodLogs }] = await Promise.all([
    supabase.from("checkins").select("date,sleep_quality,energy_level,stress_level").eq("user_id", userId).gte("date", sevenDaysAgo),
    supabase.from("food_logs").select("date,meal_type,is_healthy").eq("user_id", userId).gte("date", sevenDaysAgo),
  ]);

  if (!checkins || checkins.length < 4) {
    return new Response(JSON.stringify({ has_insight: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });

  const prompt = `Analyse this user's week.
Check-ins (last 7 days): ${JSON.stringify(checkins)}
Food logs (last 7 days): ${JSON.stringify(foodLogs ?? [])}
Find ONE meaningful cross-domain pattern (e.g. sleep quality correlating with food choices).
If fewer than 4 days of check-in data exist, return: { "has_insight": false }
If a pattern is found, return:
{
  "has_insight": true,
  "title": "5 words max, observation not advice",
  "body": "2 sentences: what the data shows + what it means for them",
  "recommendation": "one specific, small action for next week"
}
Do not fabricate patterns. Only report what the data clearly shows.
Return JSON only, no extra text.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const insightJson = JSON.parse((response.content[0] as any).text.trim());

  if (insightJson.has_insight) {
    await supabase.from("coach_messages").insert({
      user_id: userId,
      message_type: "insight",
      content: JSON.stringify(insightJson),
    });
  }

  return new Response(JSON.stringify(insightJson), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
