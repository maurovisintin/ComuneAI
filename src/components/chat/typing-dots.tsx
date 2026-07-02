import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { C } from "@/design/tokens";

function Dot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.25);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 480 }),
          withTiming(0.25, { duration: 720 })
        ),
        -1
      )
    );
  }, [opacity, delay]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width: 7,
          height: 7,
          borderRadius: 3.5,
          backgroundColor: C.fg4,
        },
        style,
      ]}
    />
  );
}

/** "L'assistente sta scrivendo" indicator. */
export function TypingDots() {
  return (
    <View
      accessible
      accessibilityLanguage="it-IT"
      accessibilityLabel="L'assistente sta scrivendo"
      style={{
        alignSelf: "flex-start",
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.hairline,
        borderRadius: 20,
        borderBottomLeftRadius: 7,
        paddingVertical: 14,
        paddingHorizontal: 17,
        flexDirection: "row",
        gap: 5,
        marginBottom: 14,
      }}
    >
      <Dot delay={0} />
      <Dot delay={180} />
      <Dot delay={360} />
    </View>
  );
}
