import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { C, FONT } from "@/design/tokens";
import { BrandGradient } from "@/components/brand-gradient";
import { Icon } from "@/components/icons/icon";
import { MessageBubble } from "@/components/chat/message-bubble";
import { TypingDots } from "@/components/chat/typing-dots";
import { AdCard } from "@/components/chat/ad-card";
import { Composer } from "@/components/chat/composer";
import { useTenantUI } from "@/context/tenant-ui";
import {
  insertMessage,
  listMessages,
  setMessageContent,
  setMessageMeta,
  touchConversation,
  updateConversationTitle,
  type Message,
} from "@/db/queries";
import { findTenant } from "@/tenants/config";
import { streamChat, type ChatMessage } from "@/api/chat";
import { inferCategory } from "@/utils/categorise";

export default function ChatScreen() {
  const { tenant, id, q } = useLocalSearchParams<{
    tenant: string;
    id: string;
    q?: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const { openDrawer } = useTenantUI();
  const [typing, setTyping] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const autoSentRef = useRef(false);

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["messages", id],
    queryFn: () => listMessages(id),
  });

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const tenantConfig = findTenant(tenant);

  const handleSend = async (text: string) => {
    if (!tenantConfig || streaming) return;

    const isFirstTurn = listMessages(id).length === 0;

    insertMessage(id, "user", text);
    const assistantMsg = insertMessage(id, "assistant", "");
    queryClient.setQueryData<Message[]>(["messages", id], () => listMessages(id));

    if (isFirstTurn) {
      const title = text.slice(0, 40).trim();
      if (title) {
        updateConversationTitle(id, title, inferCategory(title));
      }
      queryClient.invalidateQueries({ queryKey: ["conversations", tenant] });
    }

    const history: ChatMessage[] = listMessages(id)
      .filter((m) => m.id !== assistantMsg.id)
      .map<ChatMessage>((m) => ({ role: m.role, content: m.content }));

    const controller = new AbortController();
    abortRef.current = controller;
    setStreaming(true);
    setTyping(true);

    let buffer = "";
    try {
      for await (const event of streamChat({
        tenantSlug: tenant,
        systemPrompt: tenantConfig.systemPrompt,
        messages: history,
        signal: controller.signal,
      })) {
        if (controller.signal.aborted) break;
        if (event.type === "text") {
          buffer += event.chunk;
          setTyping(false);
          setMessageContent(assistantMsg.id, buffer);
        } else {
          setMessageMeta(assistantMsg.id, event.meta);
        }
        queryClient.setQueryData<Message[]>(["messages", id], () =>
          listMessages(id)
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Errore di rete";
      setMessageContent(assistantMsg.id, buffer || `⚠️ ${message}`);
      queryClient.setQueryData<Message[]>(["messages", id], () =>
        listMessages(id)
      );
    } finally {
      touchConversation(id);
      queryClient.invalidateQueries({ queryKey: ["conversations", tenant] });
      setStreaming(false);
      setTyping(false);
      abortRef.current = null;
      AccessibilityInfo.announceForAccessibility(buffer || "Risposta completata");
    }
  };

  // Auto-send the question handed over from Home / voice.
  useEffect(() => {
    if (!q || autoSentRef.current) return;
    autoSentRef.current = true;
    if (listMessages(id).length === 0) {
      handleSend(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, id]);

  if (!tenantConfig) return null;

  const firstAssistantIdx = messages.findIndex(
    (m) => m.role === "assistant" && m.content !== ""
  );
  const lastMessage = messages[messages.length - 1];
  const showAd = (m: Message, idx: number) =>
    idx === firstAssistantIdx && !(streaming && m.id === lastMessage?.id);

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={{ flex: 1, backgroundColor: C.bg }}
    >
      {/* header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 14,
          paddingBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: "rgba(255,255,255,0.86)",
          borderBottomWidth: 1,
          borderBottomColor: C.hairline,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Indietro"
          accessibilityLanguage="it-IT"
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="arrow-left" size={22} color={C.fg1} />
        </Pressable>
        <BrandGradient
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="compass" size={22} color="#FFFFFF" />
        </BrandGradient>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            accessibilityRole="header"
            accessibilityLanguage="it-IT"
            style={{ fontFamily: FONT.bold, fontSize: 16, color: C.fg1 }}
          >
            {tenantConfig.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: C.ok,
              }}
            />
            <Text
              accessibilityLanguage="it-IT"
              style={{ fontFamily: FONT.medium, fontSize: 12, color: C.ok }}
            >
              Assistente · online
            </Text>
          </View>
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
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: 16,
            paddingHorizontal: 14,
            paddingBottom: 12,
          }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((m, idx) => {
            if (m.role === "assistant" && m.content === "") return null;
            return (
              <View key={m.id}>
                <MessageBubble message={m} />
                {m.role === "assistant" && showAd(m, idx) && (
                  <AdCard comuneName={tenantConfig.name} />
                )}
              </View>
            );
          })}
          {typing && <TypingDots />}
        </ScrollView>
        <Composer onSend={handleSend} disabled={streaming} />
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
