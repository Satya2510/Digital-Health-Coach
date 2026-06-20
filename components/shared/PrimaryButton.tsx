// Standard CTA button used across all screens.
// Coach green background, white text. Disabled state is greyed out.
// Never two PrimaryButtons competing on the same screen.

import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function PrimaryButton({ label, onPress, disabled, loading }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`py-4 rounded-xl items-center ${disabled || loading ? "bg-gray-200" : "bg-coachGreen"}`}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className={`text-base font-medium ${disabled ? "text-textSecondary" : "text-white"}`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
