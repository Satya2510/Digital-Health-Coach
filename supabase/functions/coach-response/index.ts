// Supabase Edge Function: /coach-response
// Called when user taps a response option on the Coach tab.
// Generates a follow-up message from the coach based on the chosen option.
// Inserts the follow-up into coach_messages.

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

  const { userId, messageId, responseChosen } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: profile } = await supabase.from("profiles").select("name, goal").eq("id", userId).single();

  const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });

  const prompt = `You are a warm, non-judgmental health coach.
The user ${profile?.name ?? ""} chose this response: "${responseChosen}".
Write a short follow-up message (2–3 sentences max) appropriate to their choice.
If they chose "Show me a lighter plan" — acknowledge positively and say their plan is being updated.
If they chose "Not ready yet" — be gentle, validate that, and say you'll check back tomorrow.
If they chose "Tell my coach what happened" — invite them to share at their own pace.
Tone: warm, no pressure, non-judgmental.
Reply with only the message text.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 150,
    messages: [{ role: "user", content: prompt }],
  });

  const message = (response.content[0] as any).text.trim();

  await supabase.from("coach_messages").insert({
    user_id: userId,
    message_type: "daily",
    content: message,
  });

  return new Response(JSON.stringify({ message }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
