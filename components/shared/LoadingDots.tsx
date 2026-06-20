// Animated loading dots shown during every Claude API call (1–3 seconds).
// Displayed inside the green coach bubble background to signal AI is thinking.

import { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

function Dot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={{ opacity }}
      className="w-2 h-2 rounded-full bg-coachGreen mx-1"
    />
  );
}

export default function LoadingDots() {
  return (
    <View className="bg-coachGreenBg rounded-xl px-4 py-4 flex-row items-center">
      <Dot delay={0} />
      <Dot delay={200} />
      <Dot delay={400} />
    </View>
  );
}
