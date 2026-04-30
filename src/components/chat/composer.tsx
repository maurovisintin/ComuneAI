import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, TextInput, View, Text } from "@/tw";

type Props = {
  disabled?: boolean;
  onSend: (text: string) => void;
};

export function Composer({ disabled, onSend }: Props) {
  const [text, setText] = useState("");
  const insets = useSafeAreaInsets();

  const trimmed = text.trim();
  const canSend = !disabled && trimmed.length > 0;

  const handleSend = () => {
    if (!canSend) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <View
      className="px-3 pt-2 border-t border-app-separator bg-app-bg"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      <View
        className="flex-row items-end gap-2 rounded-3xl bg-app-bg-2 px-3 py-1.5"
        style={{ borderCurve: "continuous" }}
      >
        <TextInput
          className="flex-1 text-app-text text-base py-2 max-h-32"
          placeholder="Scrivi un messaggio…"
          placeholderTextColor="#8E8E93"
          multiline
          value={text}
          onChangeText={setText}
          editable={!disabled}
          submitBehavior="newline"
        />
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          className="h-9 w-9 rounded-full items-center justify-center"
          style={{
            backgroundColor: canSend ? "#007aff" : "#c7c7cc",
            borderCurve: "continuous",
          }}
        >
          <Text
            className="text-white"
            style={{ fontSize: 18, lineHeight: 20, fontWeight: "700" }}
          >
            ↑
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
