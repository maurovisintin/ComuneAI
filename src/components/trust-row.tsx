import { View, Text } from "react-native";
import { C, FONT_FAMILY_MEDIUM } from "@/design/tokens";
import { SvgIcon } from "@/components/icons/svg-icon";
import type { IconName } from "@/components/icons/icon-paths";

const ITEMS: { icon: IconName; t: string }[] = [
  { icon: "shield", t: "Fonti ufficiali" },
  { icon: "check", t: "Senza account" },
  { icon: "doc", t: "Sempre aggiornato" },
];

export function TrustRow() {
  return (
    <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}>
      {ITEMS.map((it) => (
        <View
          key={it.t}
          style={{
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 8,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: C.borderSoft,
            borderRadius: 4,
            alignItems: "flex-start",
            gap: 6,
          }}
        >
          <SvgIcon name={it.icon} size={16} color={C.blue} />
          <Text
            style={{
              fontSize: 11.5,
              color: C.text,
              fontFamily: FONT_FAMILY_MEDIUM,
              lineHeight: 14,
            }}
          >
            {it.t}
          </Text>
        </View>
      ))}
    </View>
  );
}
