// Tappable response chips shown below 48hr check-in messages.
// User taps one option → parent handles the response.
// Only shown when message has no response_chosen yet.

import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  options: string[];
  onSelect: (option: string) => void;
}

export default function ResponseOptions({ options, onSelect }: Props) {
  return (
    <View className="mt-3 gap-2">
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          onPress={() => onSelect(opt)}
          className="border border-coachGreen rounded-xl px-4 py-3"
        >
          <Text className="text-sm text-coachGreen font-medium">{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
