import { View, Text } from "react-native";
import { C, FONT_FAMILY, FONT_FAMILY_BOLD, FONT_FAMILY_MEDIUM } from "@/design/tokens";
import { MiniLogoMark } from "@/components/icons/logo-mark";
import { SvgIcon } from "@/components/icons/svg-icon";
import type { Message } from "@/db/queries";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <View
        style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 16, marginBottom: 18 }}
        accessible
        accessibilityRole="text"
        accessibilityLabel={`Tu: ${message.content}`}
        accessibilityLanguage="it-IT"
      >
        <View
          style={{
            maxWidth: "82%",
            backgroundColor: C.userBubble,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            borderBottomRightRadius: 4,
            borderBottomLeftRadius: 14,
            borderWidth: 1,
            borderColor: C.borderSoft,
          }}
        >
          <Text style={{ fontSize: 14.5, color: C.ink, lineHeight: 22, fontFamily: FONT_FAMILY }}>
            {message.content}
          </Text>
        </View>
      </View>
    );
  }

  const text = message.content || "…";

  return (
    <View
      style={{ paddingHorizontal: 16, marginBottom: 22 }}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Assistente: ${message.content || "sto scrivendo"}`}
      accessibilityLanguage="it-IT"
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <MiniLogoMark size={24} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ fontSize: 11.5, color: C.text, fontFamily: FONT_FAMILY_BOLD }}>
            Assistente del Comune
          </Text>
          <View
            style={{
              backgroundColor: C.greenSoft,
              paddingHorizontal: 5,
              paddingVertical: 1,
              borderRadius: 2,
            }}
          >
            <Text
              style={{
                fontSize: 9.5,
                color: C.greenInk,
                fontFamily: FONT_FAMILY_BOLD,
                letterSpacing: 0.4,
              }}
            >
              VERIFICATO
            </Text>
          </View>
        </View>
      </View>
      <View style={{ paddingLeft: 32 }}>
        <Text style={{ fontSize: 14.5, color: C.ink, lineHeight: 22, fontFamily: FONT_FAMILY }}>
          {text}
        </Text>
        <View style={{ flexDirection: "row", gap: 4, marginTop: 10 }}>
          <View
            style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center" }}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <SvgIcon name="copy" size={14} color={C.textFaint} />
          </View>
          <View
            style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center" }}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <SvgIcon name="thumbUp" size={14} color={C.textFaint} />
          </View>
          <View
            style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center" }}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <SvgIcon name="refresh" size={14} color={C.textFaint} />
          </View>
        </View>
      </View>
    </View>
  );
}
