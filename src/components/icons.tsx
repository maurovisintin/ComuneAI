import { View } from "react-native";
import { SvgIcon } from "./icons/svg-icon";

export function MicIcon({
  size = 20,
  color = "#ffffff",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <SvgIcon name="mic" size={size} color={color} strokeWidth={1.8} />
    </View>
  );
}

export function StopIcon({
  size = 14,
  color = "#ffffff",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: 2,
      }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
