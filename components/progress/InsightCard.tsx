// Purple weekly insight card — shown on Progress tab.
// Background: #EEEDFE (insightPurpleBg). Left border in insight purple.
// Displays: title (5 words max), body (2 sentences), recommendation.

import { View, Text } from "react-native";

interface Props {
  insight: {
    content: string;
    created_at?: string;
  };
}

export default function InsightCard({ insight }: Props) {
  let parsed: any = {};
  try {
    parsed = JSON.parse(insight.content);
  } catch {
    return null;
  }

  if (!parsed.has_insight) return null;

  return (
    <View className="bg-insightPurpleBg rounded-xl p-5 border-l-4 border-insightPurple">
      <Text className="text-xs font-medium uppercase tracking-widest text-insightPurple mb-2">
        Weekly Insight
      </Text>
      <Text className="text-[18px] font-medium text-textPrimary mb-3">
        {parsed.title}
      </Text>
      <Text className="text-base text-textPrimary leading-6 mb-4">
        {parsed.body}
      </Text>
      <View className="bg-white rounded-lg p-3">
        <Text className="text-xs font-medium uppercase tracking-widest text-insightPurple mb-1">
          This week, try
        </Text>
        <Text className="text-sm text-textPrimary">{parsed.recommendation}</Text>
      </View>
      {insight.created_at && (
        <Text className="text-xs text-textSecondary mt-3">
          {new Date(insight.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </Text>
      )}
    </View>
  );
}
