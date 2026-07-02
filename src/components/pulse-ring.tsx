import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { BrandGradient } from "@/components/brand-gradient";

type Props = {
  delay?: number;
  duration?: number;
  /** Scale reached at the end of the pulse (design: 2.3). */
  maxScale?: number;
  opacity?: number;
};

/** Expanding, fading gradient ring behind mic buttons. */
export function PulseRing({
  delay = 0,
  duration = 2400,
  maxScale = 2.3,
  opacity = 0.5,
}: Props) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.out(Easing.ease) }),
        -1
      )
    );
  }, [t, delay, duration]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity * (1 - t.value),
    transform: [{ scale: 1 + (maxScale - 1) * t.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, style]}
    >
      <BrandGradient style={{ flex: 1, borderRadius: 999 }} />
    </Animated.View>
  );
}
