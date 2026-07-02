import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { C, FONT } from "@/design/tokens";
import { BrandGradient } from "@/components/brand-gradient";
import { Icon } from "@/components/icons/icon";
import { PulseRing } from "@/components/pulse-ring";
import { StoryRing } from "@/components/story-ring";
import { useTenantUI } from "@/context/tenant-ui";
import { createConversation } from "@/db/queries";
import { findTenant } from "@/tenants/config";
import { suggestions } from "@/suggestions/config";

export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const { tenant } = useLocalSearchParams<{ tenant: string }>();
  const tenantConfig = findTenant(tenant);
  const { openDrawer, openVoice, openStories } = useTenantUI();
  const [input, setInput] = useState("");

  if (!tenantConfig) return null;

  const startChat = (text: string) => {
    const q = text.trim();
    if (!q) return;
    const conv = createConversation(tenant);
    queryClient.invalidateQueries({ queryKey: ["conversations", tenant] });
    setInput("");
    router.push({
      pathname: `/${tenant}/c/${conv.id}`,
      params: { q },
    });
  };

  const micOrSend = () => {
    if (input.trim()) startChat(input);
    else openVoice(startChat);
  };

  const hasText = input.trim().length > 0;

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}
    >
      {/* header */}
      <View
        style={{
          paddingHorizontal: 14,
          paddingTop: 8,
          paddingBottom: 10,
          minHeight: 58,
          flexDirection: "row",
          alignItems: "center",
          gap: 13,
        }}
      >
        <StoryRing onPress={openStories} />
        <View style={{ flex: 1, minWidth: 0, alignItems: "center" }}>
          <Text
            accessibilityLanguage="it-IT"
            style={{
              fontFamily: FONT.bold,
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: C.fg3,
            }}
          >
            Comune di
          </Text>
          <Text
            numberOfLines={1}
            accessibilityRole="header"
            accessibilityLanguage="it-IT"
            style={{ fontFamily: FONT.bold, fontSize: 19, color: C.fg1 }}
          >
            {tenantConfig.name}
          </Text>
        </View>
        <Pressable
          onPress={openDrawer}
          accessibilityRole="button"
          accessibilityLabel="Apri il menu"
          accessibilityLanguage="it-IT"
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="menu" size={24} color={C.fg2} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* hero */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 26,
          }}
        >
          <Text
            accessibilityRole="header"
            accessibilityLanguage="it-IT"
            style={{
              fontFamily: FONT.bold,
              fontSize: 27,
              letterSpacing: -0.4,
              color: C.fg1,
            }}
          >
            Ciao!
          </Text>
          <Text
            accessibilityLanguage="it-IT"
            style={{
              fontFamily: FONT.regular,
              fontSize: 21,
              color: C.fg3,
              marginTop: 2,
            }}
          >
            Come posso aiutarti?
          </Text>

          <Pressable
            onPress={() => openVoice(startChat)}
            accessibilityRole="button"
            accessibilityLabel="Parla con l'assistente"
            accessibilityHint="Apre la dettatura vocale"
            accessibilityLanguage="it-IT"
            style={({ pressed }) => ({
              width: 138,
              height: 138,
              marginTop: 34,
              marginBottom: 30,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            })}
          >
            <PulseRing delay={0} />
            <PulseRing delay={1200} />
            <BrandGradient
              style={{
                width: 138,
                height: 138,
                borderRadius: 69,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#6C4FD0",
                shadowOpacity: 0.42,
                shadowOffset: { width: 0, height: 16 },
                shadowRadius: 40,
                elevation: 12,
              }}
            >
              <Icon name="mic" size={46} color="#FFFFFF" />
            </BrandGradient>
          </Pressable>

          <Text
            accessibilityLanguage="it-IT"
            style={{
              fontFamily: FONT.bold,
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: C.fg4,
              marginTop: 20,
              marginBottom: 12,
            }}
          >
            Prova a chiedere
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 9,
              justifyContent: "center",
            }}
          >
            {suggestions.map((s) => (
              <Pressable
                key={s.q}
                onPress={() => startChat(s.q)}
                accessibilityRole="button"
                accessibilityLabel={s.q}
                accessibilityLanguage="it-IT"
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: C.stroke,
                  backgroundColor: C.card,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}
              >
                <Icon name={s.icon} size={18} color={C.accInk} />
                <Text
                  style={{ fontFamily: FONT.medium, fontSize: 14, color: C.fg1 }}
                >
                  {s.q}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* composer */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: Math.max(insets.bottom, 16),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: C.card,
              borderWidth: 1,
              borderColor: C.stroke,
              borderRadius: 999,
              height: 54,
              paddingLeft: 18,
              paddingRight: 5,
              shadowColor: "#0E1726",
              shadowOpacity: 0.06,
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => startChat(input)}
              placeholder="Scrivi al Comune…"
              placeholderTextColor={C.fg4}
              returnKeyType="send"
              accessibilityLabel="Scrivi al Comune"
              accessibilityLanguage="it-IT"
              style={{
                flex: 1,
                fontFamily: FONT.regular,
                fontSize: 16,
                color: C.fg1,
                paddingVertical: 0,
              }}
            />
            <Pressable
              onPress={micOrSend}
              accessibilityRole="button"
              accessibilityLabel={hasText ? "Invia messaggio" : "Avvia dettatura"}
              accessibilityLanguage="it-IT"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.92 : 1 }],
              })}
            >
              <BrandGradient
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={hasText ? "arrow-up" : "mic"} size={24} color="#FFFFFF" />
              </BrandGradient>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
