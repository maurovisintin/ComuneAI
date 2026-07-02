import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { C, FONT } from "@/design/tokens";
import { BrandGradient } from "@/components/brand-gradient";
import { Icon } from "@/components/icons/icon";
import { useTenantUI } from "@/context/tenant-ui";

type Props = {
  disabled?: boolean;
  onSend: (text: string) => void;
};

/** Chat composer: sunken input pill + gradient mic/send FAB. */
export function Composer({ disabled, onSend }: Props) {
  const insets = useSafeAreaInsets();
  const { openVoice } = useTenantUI();
  const [text, setText] = useState("");

  const trimmed = text.trim();
  const hasText = trimmed.length > 0;

  const send = () => {
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  const micOrSend = () => {
    if (disabled) return;
    if (hasText) send();
    else openVoice((transcript) => onSend(transcript));
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 10,
        paddingTop: 10,
        paddingHorizontal: 14,
        paddingBottom: Math.max(insets.bottom, 14) + 10,
        backgroundColor: "rgba(255,255,255,0.92)",
        borderTopWidth: 1,
        borderTopColor: C.hairline,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: C.sunken,
          borderRadius: 999,
          paddingVertical: 6,
          paddingLeft: 18,
          paddingRight: 6,
          minHeight: 52,
        }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Scrivi un messaggio…"
          placeholderTextColor={C.fg4}
          multiline
          editable={!disabled}
          accessibilityLabel="Campo messaggio"
          accessibilityLanguage="it-IT"
          style={{
            flex: 1,
            fontFamily: FONT.regular,
            fontSize: 16,
            lineHeight: 21,
            color: C.fg1,
            maxHeight: 120,
            paddingVertical: 8,
          }}
        />
      </View>
      <Pressable
        onPress={micOrSend}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={hasText ? "Invia messaggio" : "Avvia dettatura"}
        accessibilityHint={
          hasText ? undefined : "Apre la dettatura vocale in italiano"
        }
        accessibilityState={{ disabled: !!disabled }}
        accessibilityLanguage="it-IT"
        style={({ pressed }) => ({
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.92 : 1 }],
        })}
      >
        <BrandGradient
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#6C4FD0",
            shadowOpacity: 0.4,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 18,
            elevation: 6,
          }}
        >
          <Icon name={hasText ? "arrow-up" : "mic"} size={24} color="#FFFFFF" />
        </BrandGradient>
      </Pressable>
    </View>
  );
}
