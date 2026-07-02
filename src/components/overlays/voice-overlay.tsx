import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { C, FONT } from "@/design/tokens";
import { BrandGradient } from "@/components/brand-gradient";
import { Icon } from "@/components/icons/icon";
import { PulseRing } from "@/components/pulse-ring";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

type Props = {
  visible: boolean;
  onClose: () => void;
  onResult: (text: string) => void;
};

/** Full-screen "Sto ascoltando…" overlay driving speech recognition. */
export function VoiceOverlay({ visible, onClose, onResult }: Props) {
  const { isRecording, transcript, error, start, stop, reset } =
    useSpeechRecognition();
  const startedRef = useRef(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (visible && !startedRef.current) {
      startedRef.current = true;
      cancelledRef.current = false;
      reset();
      // Non-continuous: recognition ends on silence, then we send.
      start("it-IT", { continuous: false });
    }
    if (!visible) {
      startedRef.current = false;
    }
  }, [visible, start, reset]);

  // Recognition ended (silence or system stop) → deliver the transcript.
  const wasRecording = useRef(false);
  useEffect(() => {
    if (!visible) {
      wasRecording.current = false;
      return;
    }
    if (isRecording) {
      wasRecording.current = true;
      return;
    }
    if (wasRecording.current) {
      wasRecording.current = false;
      if (error) return; // keep the overlay up so the error is readable
      const text = transcript.trim();
      if (!cancelledRef.current && text) {
        onResult(text);
      }
      onClose();
    }
  }, [visible, isRecording, transcript, error, onResult, onClose]);

  if (!visible) return null;

  const cancel = () => {
    cancelledRef.current = true;
    if (isRecording) {
      stop();
    } else {
      onClose();
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(180)}
      style={{
        ...StyleSheet.absoluteFillObject,
        zIndex: 80,
        backgroundColor: "rgba(14,23,38,0.85)",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
      }}
    >
      <View
        style={{
          width: 120,
          height: 120,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PulseRing delay={0} duration={2000} maxScale={2.2} opacity={0.55} />
        <PulseRing delay={700} duration={2000} maxScale={2.2} opacity={0.55} />
        <BrandGradient
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="mic" size={46} color="#FFFFFF" />
        </BrandGradient>
      </View>

      <Text
        accessibilityLanguage="it-IT"
        accessibilityLiveRegion="polite"
        style={{ fontFamily: FONT.semibold, fontSize: 18, color: "#FFFFFF" }}
      >
        Sto ascoltando…
      </Text>

      <Text
        accessibilityLanguage="it-IT"
        style={{
          minHeight: 26,
          maxWidth: 300,
          textAlign: "center",
          fontFamily: FONT.regular,
          fontSize: 17,
          lineHeight: 23,
          color: error ? C.dangerBg : "rgba(255,255,255,0.85)",
          paddingHorizontal: 20,
        }}
      >
        {error ?? transcript}
      </Text>

      <Pressable
        onPress={cancel}
        accessibilityRole="button"
        accessibilityLabel="Annulla dettatura"
        accessibilityLanguage="it-IT"
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "rgba(255,255,255,0.16)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="x" size={24} color="#FFFFFF" />
      </Pressable>
    </Animated.View>
  );
}
