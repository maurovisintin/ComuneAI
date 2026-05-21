import { View } from "react-native";

export function MicIcon({
  size = 18,
  color = "#ffffff",
}: {
  size?: number;
  color?: string;
}) {
  const capsuleW = size * 0.42;
  const capsuleH = size * 0.55;
  const standW = size * 0.7;

  return (
    <View
      style={{ width: size, height: size, alignItems: "center" }}
      accessibilityLabel="Microfono"
    >
      <View
        style={{
          width: capsuleW,
          height: capsuleH,
          backgroundColor: color,
          borderRadius: capsuleW / 2,
          marginTop: size * 0.05,
        }}
      />
      <View
        style={{
          width: standW * 0.55,
          height: 2,
          backgroundColor: color,
          marginTop: size * 0.08,
        }}
      />
      <View
        style={{
          width: standW,
          height: 2,
          backgroundColor: color,
          marginTop: size * 0.05,
        }}
      />
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
      accessibilityLabel="Ferma registrazione"
    />
  );
}
