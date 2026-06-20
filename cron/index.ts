// Railway cron service entry point.
// Runs two scheduled jobs:
//   - Every 6 hours: silence detector (48hr inactive users)
//   - Every Sunday at 08:00 IST: weekly insight generator
//
// Required env vars (set in Railway dashboard):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY, RAILWAY_CRON_SECRET

import cron from "node-cron";
import { runSilenceDetector } from "./silence-detector";
import { runWeeklyInsight } from "./weekly-insight";

console.log("Health-First cron service started.");

// Every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log(`[${new Date().toISOString()}] Running silence detector...`);
  await runSilenceDetector();
});

// Every Sunday at 08:00 IST (02:30 UTC)
cron.schedule("30 2 * * 0", async () => {
  console.log(`[${new Date().toISOString()}] Running weekly insight generator...`);
  await runWeeklyInsight();
});
