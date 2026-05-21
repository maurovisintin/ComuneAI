import { Pressable, View, Text } from "react-native";
import { C, FONT_FAMILY_BOLD, FONT_FAMILY_MEDIUM } from "@/design/tokens";
import { SvgIcon } from "@/components/icons/svg-icon";
import type { Suggestion } from "@/suggestions/config";

type Props = {
  suggestion: Suggestion;
  onPress: (s: Suggestion) => void;
};

export function SuggestionCard({ suggestion, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(suggestion)}
      accessibilityRole="button"
      accessibilityLabel={`${suggestion.cat}. ${suggestion.q}`}
      accessibilityHint="Tocca due volte per inserire la domanda nel campo di scrittura"
      accessibilityLanguage="it-IT"
      style={{
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: C.borderSoft,
        borderRadius: 4,
        paddingVertical: 12,
        paddingHorizontal: 14,
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 4,
          backgroundColor: C.bgSoft,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SvgIcon name={suggestion.icon} size={18} color={suggestion.accent} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            fontSize: 10.5,
            color: suggestion.accent,
            fontFamily: FONT_FAMILY_BOLD,
            letterSpacing: 0.6,
            textTransform: "uppercase",
          }}
        >
          {suggestion.cat}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: C.ink,
            marginTop: 1,
            lineHeight: 19,
            fontFamily: FONT_FAMILY_MEDIUM,
          }}
        >
          {suggestion.q}
        </Text>
      </View>
      <SvgIcon name="chev" size={14} color={C.textMuted} />
    </Pressable>
  );
}
