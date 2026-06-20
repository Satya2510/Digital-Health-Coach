// 3-tap morning check-in: sleep quality, energy level, stress level.
// Each is rated 1/2/3 with emoji labels. One tap per dimension.
// Submit only enabled when all 3 are selected.
// Calls onSubmit(sleep, energy, stress) on tap of "Done".

import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PrimaryButton from "@/components/shared/PrimaryButton";

const SCALES = {
  sleep: [
    { val: 1, emoji: "😴", label: "Poor" },
    { val: 2, emoji: "😐", label: "Okay" },
    { val: 3, emoji: "😴✨", label: "Good" },
  ],
  energy: [
    { val: 1, emoji: "🪫", label: "Low" },
    { val: 2, emoji: "⚡", label: "Medium" },
    { val: 3, emoji: "🔋", label: "High" },
  ],
  stress: [
    { val: 1, emoji: "😌", label: "Calm" },
    { val: 2, emoji: "😤", label: "Some" },
    { val: 3, emoji: "😰", label: "High" },
  ],
};

interface Props {
  onSubmit: (sleep: number, energy: number, stress: number) => void;
}

export default function DailyCheckin({ onSubmit }: Props) {
  const [sleep, setSleep] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);

  const allSelected = sleep !== null && energy !== null && stress !== null;

  function TapRow({ title, items, value, onSelect }: { title: string; items: typeof SCALES.sleep; value: number | null; onSelect: (v: number) => void }) {
    return (
      <View className="mb-5">
        <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-3">
          {title}
        </Text>
        <View className="flex-row gap-2">
          {items.map((item) => (
            <TouchableOpacity
              key={item.val}
              onPress={() => onSelect(item.val)}
              className={`flex-1 items-center py-3 rounded-xl border ${value === item.val ? "border-coachGreen bg-coachGreenBg" : "border-gray-200 bg-card"}`}
            >
              <Text className="text-xl mb-1">{item.emoji}</Text>
              <Text className={`text-xs font-medium ${value === item.val ? "text-coachGreen" : "text-textSecondary"}`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="bg-card rounded-xl p-4">
      <Text className="text-base font-medium text-textPrimary mb-4">
        How are you doing today?
      </Text>
      <TapRow title="Sleep quality" items={SCALES.sleep} value={sleep} onSelect={setSleep} />
      <TapRow title="Energy level" items={SCALES.energy} value={energy} onSelect={setEnergy} />
      <TapRow title="Stress level" items={SCALES.stress} value={stress} onSelect={setStress} />
      <PrimaryButton
        label="Done — show my message"
        onPress={() => onSubmit(sleep!, energy!, stress!)}
        disabled={!allSelected}
      />
    </View>
  );
}
