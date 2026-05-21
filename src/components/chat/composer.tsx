import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, TextInput, View, Text } from "@/tw";
import { MicIcon, StopIcon } from "@/components/icons";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

type Props = {
  disabled?: boolean;
  onSend: (text: string) => void;
};

export function Composer({ disabled, onSend }: Props) {
  const [text, setText] = useState("");
  const insets = useSafeAreaInsets();
  const baseTextRef = useRef("");

  const { isRecording, transcript, error, start, stop, reset } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      const base = baseTextRef.current;
      const sep = base.trim().length > 0 ? " " : "";
      setText(base + sep + transcript);
    }
  }, [transcript]);

  useEffect(() => {
    return () => {
      if (isRecording) stop();
    };
  }, [isRecording, stop]);

  const trimmed = text.trim();
  const canSend = !disabled && trimmed.length > 0 && !isRecording;

  const handleSend = () => {
    if (!canSend) return;
    onSend(trimmed);
    setText("");
    baseTextRef.current = "";
    reset();
  };

  const handleMicToggle = async () => {
    if (isRecording) {
      stop();
      return;
    }
    baseTextRef.current = text;
    await start("it-IT");
  };

  const showSend = trimmed.length > 0 && !isRecording;

  return (
    <View
      className="px-3 pt-2 border-t border-app-separator bg-app-bg"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      {error ? (
        <Text className="text-app-text-2 text-xs px-2 pb-1">{error}</Text>
      ) : null}
      <View
        className="flex-row items-end gap-2 rounded-3xl bg-app-bg-2 px-3 py-1.5"
        style={{ borderCurve: "continuous" }}
      >
        <TextInput
          className="flex-1 text-app-text text-base py-2 max-h-32"
          placeholder={
            isRecording ? "Ti sto ascoltando…" : "Scrivi un messaggio…"
          }
          placeholderTextColor="#8E8E93"
          multiline
          value={text}
          onChangeText={(next) => {
            setText(next);
            if (!isRecording) baseTextRef.current = next;
          }}
          editable={!disabled && !isRecording}
          submitBehavior="newline"
        />
        {showSend ? (
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
        ) : (
          <Pressable
            onPress={handleMicToggle}
            disabled={disabled}
            className="h-9 w-9 rounded-full items-center justify-center"
            style={{
              backgroundColor: isRecording ? "#ff3b30" : "#007aff",
              borderCurve: "continuous",
              opacity: disabled ? 0.4 : 1,
            }}
            accessibilityLabel={
              isRecording ? "Ferma registrazione" : "Dettatura vocale"
            }
          >
            {isRecording ? (
              <StopIcon size={12} color="#ffffff" />
            ) : (
              <MicIcon size={18} color="#ffffff" />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
