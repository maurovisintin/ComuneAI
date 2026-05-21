import { View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { C } from "@/design/tokens";

export function LogoMark({
  size = 32,
  inverted = true,
}: {
  size?: number;
  inverted?: boolean;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        backgroundColor: inverted ? "rgba(255,255,255,0.14)" : C.blue,
        borderWidth: inverted ? 1 : 0,
        borderColor: inverted ? "rgba(255,255,255,0.28)" : "transparent",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
      >
        <Path d="M3 10 L12 4 L21 10 V11 H3 Z" fill="#FFFFFF" />
        <Rect x={5} y={12} width={2.2} height={6.5} fill="#FFFFFF" />
        <Rect x={10.9} y={12} width={2.2} height={6.5} fill="#FFFFFF" />
        <Rect x={16.8} y={12} width={2.2} height={6.5} fill="#FFFFFF" />
        <Rect x={3} y={19.5} width={18} height={1.5} fill="#FFFFFF" />
      </Svg>
    </View>
  );
}

export function MiniLogoMark({ size = 24 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        backgroundColor: C.blue,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
      >
        <Path d="M3 10 L12 4 L21 10 V11 H3 Z" fill="#FFFFFF" />
        <Rect x={6} y={12} width={2} height={6} fill="#FFFFFF" />
        <Rect x={11} y={12} width={2} height={6} fill="#FFFFFF" />
        <Rect x={16} y={12} width={2} height={6} fill="#FFFFFF" />
        <Rect x={3} y={19} width={18} height={1.5} fill="#FFFFFF" />
      </Svg>
    </View>
  );
}
