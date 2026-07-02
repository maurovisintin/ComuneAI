import { useEffect } from "react";
import { View } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { C } from "@/design/tokens";

function BrandGradientDefs({ id }: { id: string }) {
  return (
    <Defs>
      <LinearGradient id={id} x1="10%" y1="0%" x2="90%" y2="100%">
        <Stop offset="0" stopColor={C.g0} />
        <Stop offset="0.52" stopColor={C.g1} />
        <Stop offset="1" stopColor={C.g2} />
      </LinearGradient>
    </Defs>
  );
}

/**
 * ComuneAI logo: gradient map-pin with a compass rose that slowly spins.
 * Geometry lifted 1:1 from the handoff SVG (viewBox 0 0 120 120,
 * rose centered at 60,48 with radius 25).
 */
export function LogoPin({
  size = 84,
  spinning = true,
}: {
  size?: number;
  spinning?: boolean;
}) {
  const scale = size / 120;
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (spinning) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 16000, easing: Easing.linear }),
        -1
      );
    } else {
      rotation.value = 0;
    }
  }, [spinning, rotation]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const roseSize = 50 * scale;

  return (
    <View
      style={{ width: size, height: size }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <BrandGradientDefs id="logoPin" />
        <Path
          d="M60,113 C40,84 25,70 25,48 a35,35 0 1,1 70,0 C95,70 80,84 60,113 Z"
          fill="url(#logoPin)"
          stroke="url(#logoPin)"
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <Circle cx={60} cy={48} r={25} fill="#FFFFFF" />
      </Svg>
      <Animated.View
        style={[
          {
            position: "absolute",
            left: (60 - 25) * scale,
            top: (48 - 25) * scale,
            width: roseSize,
            height: roseSize,
          },
          spinStyle,
        ]}
      >
        <Svg width={roseSize} height={roseSize} viewBox="35 23 50 50">
          <BrandGradientDefs id="logoRose" />
          <G
            fill="url(#logoRose)"
            stroke="url(#logoRose)"
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <Path d="M60,28 L53.5,48 L66.5,48 Z" />
            <Path d="M80,48 L60,41.5 L60,54.5 Z" />
            <Path d="M60,68 L53.5,48 L66.5,48 Z" />
            <Path d="M40,48 L60,41.5 L60,54.5 Z" />
            <Circle cx={60} cy={48} r={4} stroke="none" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}
