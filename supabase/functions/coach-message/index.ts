// Supabase Edge Function: /coach-message
// Called from the mobile app after a daily check-in is submitted.
// Generates a personalised coach message via Claude API.
// Inserts the message into coach_messages table.
// Returns: { message: string }
//
// ANTHROPIC_API_KEY is set as a Supabase Edge Function secret (server-side only).

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

  const { userId, sleep, energy, stress, goal } = await req.json();

  const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });

  const prompt = `You are a warm, non-judgmental health coach for an urban Indian professional.
The user has logged: sleep quality = ${sleep}/3, energy = ${energy}/3, stress = ${stress}/3.
Their health goal is: ${goal ?? "general wellness"}.
Write ONE coaching message (2 sentences max).
Be specific to their numbers. No generic motivational quotes.
First sentence: acknowledge their current state.
Second sentence: one small, specific action for today only.
Tone: like a knowledgeable friend, not a trainer or a doctor.
Reply with only the message text, no labels or formatting.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 150,
    messages: [{ role: "user", content: prompt }],
  });

  const message = (response.content[0] as any).text.trim();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  await supabase.from("coach_messages").insert({
    user_id: userId,
    message_type: "daily",
    content: message,
  });

  return new Response(JSON.stringify({ message }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
