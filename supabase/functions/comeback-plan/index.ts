// Supabase Edge Function: /comeback-plan
// Called when a user opens the app after 5+ days of inactivity.
// Generates a lighter re-entry plan via Claude API.
// Deactivates old plan, inserts new comeback plan.
// Returns the plan object: { movement, food, sleep, encouragement }

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

  const { userId, name, daysSince, originalPlan } = await req.json();
  const movement = originalPlan?.movement_target ?? "daily movement";
  const food = originalPlan?.food_target ?? "eating well";
  const sleep = originalPlan?.sleep_target ?? "consistent sleep";

  const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });

  const prompt = `The user ${name ?? "there"} is returning after ${daysSince} days away.
Their original plan: movement=${movement}, food=${food}, sleep=${sleep}.
Generate a LIGHTER plan for this week only — easier than the original, not the same.
Format as JSON:
{
  "movement": "one small action starting with 'Just'",
  "food": "one simple food habit starting with 'Only'",
  "sleep": "one sleep habit starting with 'Just'",
  "encouragement": "one sentence, warm, does not use the word 'journey'"
}
Each target must be noticeably easier than the original.
Return JSON only, no extra text.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const planJson = JSON.parse((response.content[0] as any).text.trim());

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  await supabase.from("plans").update({ is_active: false }).eq("user_id", userId).eq("is_active", true);

  await supabase.from("plans").insert({
    user_id: userId,
    plan_type: "comeback",
    movement_target: planJson.movement,
    food_target: planJson.food,
    sleep_target: planJson.sleep,
    is_active: true,
  });

  await supabase.from("coach_messages").insert({
    user_id: userId,
    message_type: "comeback",
    content: planJson.encouragement,
  });

  return new Response(JSON.stringify(planJson), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
