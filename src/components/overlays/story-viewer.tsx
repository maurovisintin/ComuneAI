import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { FONT } from "@/design/tokens";
import { BrandGradient } from "@/components/brand-gradient";
import { Icon } from "@/components/icons/icon";
import type { Story } from "@/stories/config";

const STORY_DURATION = 4100;

function Segment({
  state,
  progress,
}: {
  state: "done" | "active" | "todo";
  progress: SharedValue<number>;
}) {
  const fillStyle = useAnimatedStyle(() => ({
    width: `${state === "done" ? 100 : state === "active" ? progress.value * 100 : 0}%`,
  }));
  return (
    <View
      style={{
        flex: 1,
        height: 3,
        borderRadius: 2,
        backgroundColor: "rgba(255,255,255,0.32)",
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          { height: "100%", backgroundColor: "#FFFFFF", borderRadius: 2 },
          fillStyle,
        ]}
      />
    </View>
  );
}

type Props = {
  visible: boolean;
  stories: Story[];
  onClose: () => void;
};

/** Instagram-style full-screen story viewer for "Novità dal Comune". */
export function StoryViewer({ visible, stories, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const progress = useSharedValue(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const advance = useCallback(
    (from: number) => {
      if (from >= stories.length - 1) {
        onClose();
        return;
      }
      setIndex(from + 1);
    },
    [stories.length, onClose]
  );

  // (Re)start the segment timer whenever the viewer opens or the index moves.
  useEffect(() => {
    if (!visible) {
      setIndex(0);
      progress.value = 0;
      clear();
      return;
    }
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: STORY_DURATION,
      easing: Easing.linear,
    });
    clear();
    timer.current = setTimeout(() => advance(index), STORY_DURATION);
    return clear;
  }, [visible, index, advance, progress]);

  if (!visible) return null;

  const story = stories[Math.min(index, stories.length - 1)];

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => advance(index);

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(180)}
      style={{ ...StyleSheet.absoluteFillObject, zIndex: 90 }}
    >
      <BrandGradient style={StyleSheet.absoluteFillObject} />
      <LinearGradient
        colors={["rgba(14,23,38,0.15)", "rgba(14,23,38,0.78)"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* tap zones */}
      <Pressable
        onPress={prev}
        accessibilityRole="button"
        accessibilityLabel="Storia precedente"
        accessibilityLanguage="it-IT"
        style={{
          position: "absolute",
          left: 0,
          top: insets.top + 90,
          bottom: 0,
          width: "32%",
          zIndex: 1,
        }}
      />
      <Pressable
        onPress={next}
        accessibilityRole="button"
        accessibilityLabel="Storia successiva"
        accessibilityLanguage="it-IT"
        style={{
          position: "absolute",
          right: 0,
          top: insets.top + 90,
          bottom: 0,
          width: "68%",
          zIndex: 1,
        }}
      />

      {/* progress segments */}
      <View
        style={{
          zIndex: 2,
          paddingTop: insets.top + 8,
          paddingHorizontal: 14,
          flexDirection: "row",
          gap: 5,
        }}
      >
        {stories.map((s, i) => (
          <Segment
            key={s.title}
            state={i < index ? "done" : i === index ? "active" : "todo"}
            progress={progress}
          />
        ))}
      </View>

      {/* header */}
      <View
        style={{
          zIndex: 3,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 11,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.18)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={story.icon} size={20} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONT.bold, fontSize: 14, color: "#FFFFFF" }}>
            {story.label}
          </Text>
          <Text
            style={{
              fontFamily: FONT.medium,
              fontSize: 12,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Comune · ora
          </Text>
        </View>
        <Pressable
          onPress={onClose}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Chiudi le novità"
          accessibilityLanguage="it-IT"
        >
          <Icon name="x" size={24} color="rgba(255,255,255,0.8)" />
        </Pressable>
      </View>

      {/* content */}
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingHorizontal: 28,
          paddingBottom: insets.bottom + 76,
          gap: 14,
        }}
      >
        <Text
          accessibilityLanguage="it-IT"
          style={{
            fontFamily: FONT.bold,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.72)",
          }}
        >
          {story.kicker}
        </Text>
        <Text
          accessibilityRole="header"
          accessibilityLanguage="it-IT"
          style={{
            fontFamily: FONT.bold,
            fontSize: 32,
            lineHeight: 37,
            letterSpacing: -0.5,
            color: "#FFFFFF",
          }}
        >
          {story.title}
        </Text>
        <Text
          accessibilityLanguage="it-IT"
          style={{
            fontFamily: FONT.regular,
            fontSize: 17,
            lineHeight: 26,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {story.body}
        </Text>
      </View>
    </Animated.View>
  );
}
