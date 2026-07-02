import type { ComponentProps } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENT } from "@/design/tokens";

type Props = Omit<
  ComponentProps<typeof LinearGradient>,
  "colors" | "locations" | "start" | "end"
>;

/** 135deg brand gradient surface (blue → purple → red). */
export function BrandGradient(props: Props) {
  return (
    <LinearGradient
      colors={[...GRADIENT.colors]}
      locations={[...GRADIENT.locations]}
      start={GRADIENT.start}
      end={GRADIENT.end}
      {...props}
    />
  );
}
