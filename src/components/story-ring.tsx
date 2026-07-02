import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { C } from "@/design/tokens";

const SIZE = 44;
const STROKE = 3.5;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;
/** The design's conic ring covers 72% of the turn, starting at 12 o'clock. */
const ARC = 0.72;

/**
 * "Novità dal Comune" entry point — a slowly rotating, breathing gradient
 * arc, approximating the prototype's animated conic-gradient ring.
 */
export function StoryRing({ onPress }: { onPress: () => void }) {
  const rotation = useSharedValue(0);
  const breath = useSharedValue(0.4);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 9000, easing: Easing.linear }),
      -1
    );
    breath.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [rotation, breath]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: breath.value,
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Novità dal Comune"
      accessibilityLanguage="it-IT"
      hitSlop={6}
      style={{ width: SIZE, height: SIZE }}
    >
      <View
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: SIZE / 2,
          backgroundColor: C.accSoft,
        }}
      />
      <Animated.View style={[{ position: "absolute", inset: 0 }, ringStyle]}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Defs>
            <LinearGradient id="storyRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0" stopColor={C.g0} />
              <Stop offset="0.5" stopColor={C.g1} />
              <Stop offset="1" stopColor={C.g2} />
            </LinearGradient>
          </Defs>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="url(#storyRing)"
            strokeWidth={STROKE}
            strokeDasharray={`${CIRCUMFERENCE * ARC} ${CIRCUMFERENCE}`}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </Svg>
      </Animated.View>
    </Pressable>
  );
}
