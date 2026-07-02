import { useCallback, useState } from "react";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

type State = {
  isRecording: boolean;
  partial: string;
  final: string;
  error: string | null;
};

const INITIAL: State = {
  isRecording: false,
  partial: "",
  final: "",
  error: null,
};

export function useSpeechRecognition() {
  const [state, setState] = useState<State>(INITIAL);

  useSpeechRecognitionEvent("start", () => {
    setState((s) => ({ ...s, isRecording: true, error: null }));
  });

  useSpeechRecognitionEvent("end", () => {
    setState((s) => ({ ...s, isRecording: false }));
  });

  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results[0]?.transcript ?? "";
    if (event.isFinal) {
      setState((s) => ({
        ...s,
        final: s.final ? `${s.final} ${transcript}` : transcript,
        partial: "",
      }));
    } else {
      setState((s) => ({ ...s, partial: transcript }));
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    setState((s) => ({
      ...s,
      isRecording: false,
      error: event.message || event.error || "Errore di riconoscimento vocale",
    }));
  });

  const start = useCallback(async (lang = "it-IT", options?: { continuous?: boolean }) => {
    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) {
      setState((s) => ({
        ...s,
        error:
          "Per usare la dettatura abilita microfono e riconoscimento vocale nelle impostazioni.",
      }));
      return false;
    }
    setState({ ...INITIAL });
    ExpoSpeechRecognitionModule.start({
      lang,
      interimResults: true,
      continuous: options?.continuous ?? true,
      addsPunctuation: true,
    });
    return true;
  }, []);

  const stop = useCallback(() => {
    ExpoSpeechRecognitionModule.stop();
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL);
  }, []);

  const transcript =
    state.final && state.partial
      ? `${state.final} ${state.partial}`
      : state.final || state.partial;

  return {
    isRecording: state.isRecording,
    transcript,
    error: state.error,
    start,
    stop,
    reset,
  };
}
