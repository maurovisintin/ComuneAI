import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  TextInput,
  View,
  Text,
  type TextInput as RNTextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C, FONT_FAMILY, FONT_FAMILY_MEDIUM } from "@/design/tokens";
import { MicIcon, StopIcon } from "@/components/icons";
import { SvgIcon } from "@/components/icons/svg-icon";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

export type ComposerHandle = {
  setText: (text: string, options?: { focus?: boolean }) => void;
};

type Props = {
  disabled?: boolean;
  placeholder?: string;
  onSend: (text: string) => void;
};

export const Composer = forwardRef<ComposerHandle, Props>(function Composer(
  { disabled, placeholder = "Scrivi la tua domanda…", onSend },
  ref
) {
  const [text, setTextState] = useState("");
  const insets = useSafeAreaInsets();
  const baseTextRef = useRef("");
  const inputRef = useRef<RNTextInput>(null);

  const { isRecording, transcript, error, start, stop, reset } =
    useSpeechRecognition();

  useImperativeHandle(
    ref,
    () => ({
      setText: (next, options) => {
        setTextState(next);
        baseTextRef.current = next;
        if (options?.focus) inputRef.current?.focus();
      },
    }),
    []
  );

  useEffect(() => {
    if (transcript) {
      const base = baseTextRef.current;
      const sep = base.trim().length > 0 ? " " : "";
      setTextState(base + sep + transcript);
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
    setTextState("");
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
      style={{
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: Math.max(insets.bottom, 14),
        backgroundColor: C.bg,
        borderTopWidth: 1,
        borderTopColor: C.borderSoft,
      }}
    >
      {error ? (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          accessibilityLanguage="it-IT"
          style={{
            fontSize: 11,
            color: C.red,
            paddingHorizontal: 6,
            paddingBottom: 4,
            fontFamily: FONT_FAMILY,
          }}
        >
          {error}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 8,
          backgroundColor: "#FFFFFF",
          borderWidth: 1.5,
          borderColor: C.border,
          borderRadius: 24,
          paddingLeft: 16,
          paddingRight: 6,
          paddingVertical: 6,
        }}
      >
        <TextInput
          ref={inputRef}
          style={{
            flex: 1,
            fontSize: 15,
            color: C.ink,
            fontFamily: FONT_FAMILY,
            paddingVertical: 8,
            maxHeight: 128,
            lineHeight: 20,
          }}
          placeholder={isRecording ? "Ti sto ascoltando…" : placeholder}
          placeholderTextColor={C.textFaint}
          multiline
          value={text}
          onChangeText={(next) => {
            setTextState(next);
            if (!isRecording) baseTextRef.current = next;
          }}
          editable={!disabled && !isRecording}
          submitBehavior="newline"
          accessibilityLabel="Campo messaggio"
          accessibilityLanguage="it-IT"
        />
        {showSend ? (
          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Invia messaggio"
            accessibilityState={{ disabled: !canSend }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: canSend ? C.blue : C.textFaint,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SvgIcon name="send" size={18} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>
        ) : (
          <Pressable
            onPress={handleMicToggle}
            disabled={disabled}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={isRecording ? "Ferma dettatura" : "Avvia dettatura"}
            accessibilityHint="Tocca due volte per attivare o disattivare la dettatura vocale in italiano"
            accessibilityState={{ disabled: !!disabled, selected: isRecording }}
            accessibilityLanguage="it-IT"
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: isRecording ? "#ff3b30" : C.blue,
              opacity: disabled ? 0.4 : 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isRecording ? (
              <StopIcon size={12} color="#FFFFFF" />
            ) : (
              <MicIcon size={18} color="#FFFFFF" />
            )}
          </Pressable>
        )}
      </View>
      <Text
        style={{
          fontSize: 10.5,
          color: C.textFaint,
          textAlign: "center",
          marginTop: 8,
          lineHeight: 14,
          paddingHorizontal: 8,
          fontFamily: FONT_FAMILY,
        }}
        accessibilityLanguage="it-IT"
      >
        Le risposte si basano sui regolamenti pubblici del Comune. Verifica
        sempre i documenti ufficiali.
      </Text>
    </View>
  );
});
