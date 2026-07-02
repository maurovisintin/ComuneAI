import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { C, FONT } from "@/design/tokens";
import { BrandGradient } from "@/components/brand-gradient";
import { LogoPin } from "@/components/icons/logo-mark";
import { Icon, type IconName } from "@/components/icons/icon";

const ADVANTAGES: { icon: IconName; label: string }[] = [
  { icon: "smile", label: "Semplice\nda usare" },
  { icon: "shield-check", label: "Fonti 100%\nufficiali" },
  { icon: "refresh-cw", label: "Sempre\naggiornata" },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={{
        flex: 1,
        backgroundColor: C.card,
        alignItems: "center",
        paddingHorizontal: 28,
        paddingTop: insets.top,
      }}
    >
      <View style={{ height: 96 }} />
      <LogoPin size={84} />

      <Text
        accessibilityRole="header"
        accessibilityLanguage="it-IT"
        style={{
          fontFamily: FONT.extrabold,
          fontSize: 28,
          lineHeight: 33,
          letterSpacing: -0.6,
          color: C.fg1,
          textAlign: "center",
          marginTop: 24,
        }}
      >
        Il tuo Comune,{"\n"}a portata di chat
      </Text>
      <Text
        accessibilityLanguage="it-IT"
        style={{
          fontFamily: FONT.regular,
          fontSize: 16,
          lineHeight: 24,
          color: C.fg2,
          textAlign: "center",
          marginTop: 12,
        }}
      >
        Chiedimi quello che ti serve: ti rispondo{"\n"}con parole semplici e ti
        guido al posto giusto.{"\n"}Anche a voce.
      </Text>

      <View style={{ flexDirection: "row", gap: 10, width: "100%", marginTop: 32 }}>
        {ADVANTAGES.map((a) => (
          <View
            key={a.icon}
            style={{
              flex: 1,
              alignItems: "center",
              gap: 9,
              paddingVertical: 16,
              paddingHorizontal: 6,
              borderWidth: 1,
              borderColor: C.stroke,
              borderRadius: 16,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: C.accSoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={a.icon} size={23} color={C.accInk} />
            </View>
            <Text
              accessibilityLanguage="it-IT"
              style={{
                fontFamily: FONT.semibold,
                fontSize: 12,
                lineHeight: 15,
                color: C.fg1,
                textAlign: "center",
              }}
            >
              {a.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ flex: 1, minHeight: 20 }} />

      <Pressable
        onPress={() => router.push("/select-tenant")}
        accessibilityRole="button"
        accessibilityLabel="Continua"
        accessibilityLanguage="it-IT"
        style={({ pressed }) => ({
          width: "100%",
          marginBottom: Math.max(insets.bottom, 20) + 14,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        })}
      >
        <BrandGradient
          style={{
            height: 54,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontFamily: FONT.bold, fontSize: 17, color: "#FFFFFF" }}>
            Continua
          </Text>
        </BrandGradient>
      </Pressable>
    </Animated.View>
  );
}
