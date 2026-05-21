import { Pressable, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C, FONT_FAMILY_BOLD, FONT_FAMILY_MEDIUM } from "@/design/tokens";
import { Crest } from "@/components/icons/crest";
import { LogoMark } from "@/components/icons/logo-mark";
import { SvgIcon } from "@/components/icons/svg-icon";
import type { Tenant } from "@/tenants/config";

type Props =
  | { variant: "logo"; subtitle?: string }
  | {
      variant: "comune";
      tenant: Tenant;
      onBack?: () => void;
      onMenu?: () => void;
    };

export function ComuneHeader(props: Props) {
  const insets = useSafeAreaInsets();
  const fillerHeight = Math.max(insets.top, 44) + 10;

  return (
    <View style={{ backgroundColor: C.blue, borderBottomWidth: 3, borderBottomColor: C.blueDark }}>
      <View style={{ backgroundColor: C.blueDarker, height: fillerHeight }} />
      <View
        style={{
          backgroundColor: C.blueDarker,
          paddingHorizontal: 18,
          paddingVertical: 4,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 10.5,
            color: "#FFFFFF",
            opacity: 0.85,
            letterSpacing: 0.6,
            fontFamily: FONT_FAMILY_MEDIUM,
          }}
        >
          ★ SERVIZIO UFFICIALE
        </Text>
        <Text
          style={{
            fontSize: 10.5,
            color: "#FFFFFF",
            opacity: 0.75,
            letterSpacing: 0.6,
            fontFamily: FONT_FAMILY_MEDIUM,
          }}
        >
          IT · EN
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        {props.variant === "comune" ? (
          props.onBack ? (
            <Pressable
              onPress={props.onBack}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Indietro"
              style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center", marginLeft: -8 }}
            >
              <SvgIcon name="back" size={22} color="#FFFFFF" strokeWidth={2.2} />
            </Pressable>
          ) : (
            <Pressable
              onPress={props.onMenu}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Menu"
              style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}
            >
              <SvgIcon name="menu" size={22} color="#FFFFFF" strokeWidth={2} />
            </Pressable>
          )
        ) : null}

        {props.variant === "comune" ? (
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}
          >
            <Crest size={32} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={{
                  fontSize: 9.5,
                  color: "#FFFFFF",
                  opacity: 0.8,
                  letterSpacing: 0.8,
                  fontFamily: FONT_FAMILY_MEDIUM,
                  textTransform: "uppercase",
                }}
              >
                Comune di
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 15,
                    color: "#FFFFFF",
                    fontFamily: FONT_FAMILY_BOLD,
                    flex: 1,
                  }}
                >
                  {props.tenant.name}
                </Text>
                <SvgIcon name="chevDn" size={12} color="#FFFFFF" strokeWidth={2.4} />
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}
          >
            <LogoMark size={32} />
            <View>
              <Text style={{ color: "#FFFFFF", fontFamily: FONT_FAMILY_BOLD, fontSize: 17 }}>
                Comuni
                <Text style={{ opacity: 0.78, fontFamily: FONT_FAMILY_MEDIUM }}>AI</Text>
              </Text>
              <Text
                style={{
                  fontSize: 10.5,
                  color: "#FFFFFF",
                  opacity: 0.8,
                  marginTop: 1,
                  fontFamily: FONT_FAMILY_MEDIUM,
                }}
              >
                {props.subtitle ?? "Servizi digitali comunali"}
              </Text>
            </View>
          </View>
        )}

        <View
          style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <SvgIcon name="search" size={20} color="#FFFFFF" strokeWidth={1.8} />
        </View>
      </View>
    </View>
  );
}
