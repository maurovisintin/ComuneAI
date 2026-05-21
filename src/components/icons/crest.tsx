import Svg, { Path, Rect, Circle } from "react-native-svg";
import { C } from "@/design/tokens";

export function Crest({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path
        d="M20 2 L36 7 V20 C36 28 29 35 20 38 C11 35 4 28 4 20 V7 Z"
        fill="#FFFFFF"
        stroke={C.blue}
        strokeWidth={1.4}
      />
      <Rect x={13} y={14} width={14} height={14} fill={C.blue} />
      <Rect x={15} y={17} width={2} height={4} fill="#FFFFFF" />
      <Rect x={19} y={17} width={2} height={4} fill="#FFFFFF" />
      <Rect x={23} y={17} width={2} height={4} fill="#FFFFFF" />
      <Rect x={15} y={23} width={2} height={3} fill="#FFFFFF" />
      <Rect x={19} y={23} width={2} height={3} fill="#FFFFFF" />
      <Rect x={23} y={23} width={2} height={3} fill="#FFFFFF" />
      <Path d="M11 14 L20 9 L29 14 Z" fill={C.blue} />
      <Circle cx={20} cy={8} r={1.4} fill={C.gold} />
    </Svg>
  );
}
