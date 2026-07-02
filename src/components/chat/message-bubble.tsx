import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { C, FONT } from "@/design/tokens";
import { Icon } from "@/components/icons/icon";
import type { Message } from "@/db/queries";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <Animated.View
        entering={FadeInDown.duration(260)}
        accessible
        accessibilityRole="text"
        accessibilityLabel={`Tu: ${message.content}`}
        accessibilityLanguage="it-IT"
        style={{
          alignSelf: "flex-end",
          maxWidth: "84%",
          backgroundColor: C.acc,
          paddingVertical: 11,
          paddingHorizontal: 15,
          borderRadius: 20,
          borderBottomRightRadius: 7,
          marginBottom: 14,
          shadowColor: "#0E1726",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <Text
          style={{
            fontFamily: FONT.regular,
            fontSize: 16,
            lineHeight: 23,
            color: "#FFFFFF",
          }}
        >
          {message.content}
        </Text>
      </Animated.View>
    );
  }

  const meta = message.meta;

  return (
    <Animated.View
      entering={FadeInDown.duration(280)}
      style={{
        alignSelf: "flex-start",
        maxWidth: "90%",
        gap: 8,
        marginBottom: 14,
      }}
    >
      <View
        accessible
        accessibilityRole="text"
        accessibilityLabel={`Assistente: ${message.content}`}
        accessibilityLanguage="it-IT"
        style={{
          backgroundColor: C.card,
          borderWidth: 1,
          borderColor: C.hairline,
          paddingVertical: 13,
          paddingHorizontal: 16,
          borderRadius: 20,
          borderBottomLeftRadius: 7,
        }}
      >
        <Text
          style={{
            fontFamily: FONT.regular,
            fontSize: 16,
            lineHeight: 24,
            color: C.fg1,
          }}
        >
          {message.content}
        </Text>
      </View>

      {meta?.highlight && (
        <View
          accessible
          accessibilityLanguage="it-IT"
          style={{
            backgroundColor: C.accSoft,
            borderRadius: 16,
            paddingVertical: 14,
            paddingHorizontal: 16,
            gap: 9,
          }}
        >
          <Text
            style={{
              fontFamily: FONT.bold,
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: C.accInk,
            }}
          >
            {meta.highlight.title}
          </Text>
          {meta.highlight.lines.map((line) => (
            <View
              key={line}
              style={{ flexDirection: "row", alignItems: "flex-start", gap: 9 }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: C.accInk,
                  marginTop: 7,
                }}
              />
              <Text
                style={{
                  flex: 1,
                  fontFamily: FONT.medium,
                  fontSize: 15,
                  lineHeight: 21,
                  color: C.fg1,
                }}
              >
                {line}
              </Text>
            </View>
          ))}
        </View>
      )}

      {meta?.sources && meta.sources.length > 0 && (
        <View style={{ gap: 7 }}>
          <Text
            accessibilityLanguage="it-IT"
            style={{
              fontFamily: FONT.bold,
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: C.fg3,
              marginTop: 2,
            }}
          >
            Fonti ufficiali
          </Text>
          {meta.sources.map((src) => (
            <Pressable
              key={src.label}
              accessibilityRole="button"
              accessibilityLabel={`Fonte: ${src.label}`}
              accessibilityLanguage="it-IT"
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 11,
                paddingHorizontal: 13,
                borderRadius: 13,
                borderWidth: 1,
                borderColor: C.stroke,
                backgroundColor: pressed ? C.sunken : C.card,
              })}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  backgroundColor: C.accSoft,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name={src.ext ? "external-link" : "file-text"}
                  size={16}
                  color={C.accInk}
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontFamily: FONT.semibold,
                  fontSize: 13.5,
                  lineHeight: 18,
                  color: C.fg1,
                }}
              >
                {src.label}
              </Text>
              {src.meta ? (
                <Text
                  style={{ fontFamily: FONT.mono, fontSize: 12, color: C.fg4 }}
                >
                  {src.meta}
                </Text>
              ) : null}
            </Pressable>
          ))}
        </View>
      )}

      {meta?.verified && (
        <View
          accessible
          accessibilityLanguage="it-IT"
          accessibilityLabel="Verificato dalle fonti del Comune"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginTop: 1,
          }}
        >
          <Icon name="badge-check" size={14} color={C.ok} />
          <Text style={{ fontFamily: FONT.semibold, fontSize: 12, color: C.ok }}>
            Verificato dalle fonti del Comune
          </Text>
        </View>
      )}
    </Animated.View>
  );
}
