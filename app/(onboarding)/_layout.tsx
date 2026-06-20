// Onboarding stack layout — 3 steps: goal → history → schedule.
// No bottom nav bar. Shows a progress bar at the top (1/3, 2/3, 3/3).

import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="goal" />
      <Stack.Screen name="history" />
      <Stack.Screen name="schedule" />
    </Stack>
  );
}
