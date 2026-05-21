import { Pressable, View, Text } from "react-native";
import { C, FONT_FAMILY, FONT_FAMILY_MEDIUM } from "@/design/tokens";
import { Crest } from "@/components/icons/crest";
import { SvgIcon } from "@/components/icons/svg-icon";
import type { Tenant } from "@/tenants/config";

type Props = {
  tenant: Tenant;
  onPress: (tenant: Tenant) => void;
  showBottomBorder?: boolean;
};

export function TenantRow({ tenant, onPress, showBottomBorder = true }: Props) {
  return (
    <Pressable
      onPress={() => onPress(tenant)}
      accessibilityRole="button"
      accessibilityLabel={`Comune di ${tenant.name}`}
      accessibilityHint="Apre il chatbot di questo Comune"
      accessibilityLanguage="it-IT"
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: pressed ? C.bgSoft : "#FFFFFF",
        borderBottomWidth: showBottomBorder ? 1 : 0,
        borderBottomColor: C.borderSoft,
      })}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Crest size={32} />
      </View>
      <View
        style={{ flex: 1, minWidth: 0 }}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Text
          style={{
            fontSize: 15,
            color: C.ink,
            fontFamily: FONT_FAMILY_MEDIUM,
            lineHeight: 19,
          }}
        >
          Comune di {tenant.name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: C.textMuted,
            marginTop: 2,
            fontFamily: FONT_FAMILY,
          }}
        >
          {tenant.region} · Provincia di {tenant.province}
        </Text>
      </View>
      <SvgIcon name="chev" size={16} color={C.textMuted} />
    </Pressable>
  );
}
