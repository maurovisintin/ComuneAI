import Svg, { Path } from "react-native-svg";
import { IconPaths, type IconName } from "./icon-paths";

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
};

export function SvgIcon({
  name,
  size = 20,
  color = "currentColor",
  strokeWidth = 1.8,
  fill = "none",
}: Props) {
  const paths = IconPaths[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {paths.map((d, i) => (
        <Path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={fill}
        />
      ))}
    </Svg>
  );
}
