import { useEffect, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  C,
  FONT_FAMILY,
  FONT_FAMILY_BOLD,
  FONT_FAMILY_MEDIUM,
} from "@/design/tokens";
import { ComuneHeader } from "@/components/comune-header";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Composer, type ComposerHandle } from "@/components/chat/composer";
import { EmptyChat } from "@/components/chat/empty-chat";
import {
  getConversation,
  insertMessage,
  listMessages,
  setMessageContent,
  touchConversation,
  updateConversationTitle,
  type Message,
} from "@/db/queries";
import { findTenant } from "@/tenants/config";
import { streamChat, type ChatMessage } from "@/api/chat";
import { inferCategory, categoryStyle } from "@/utils/categorise";
import { shortItalianTime } from "@/utils/group-conversations";
import type { Suggestion } from "@/suggestions/config";

export default function ChatScreen() {
  const { tenant, id } = useLocalSearchParams<{ tenant: string; id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const composerRef = useRef<ComposerHandle>(null);

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

  const conversation = useMemo(() => getConversation(id), [id, messages.length]);
  const category = conversation?.category ?? "Generale";
  const catStyle = categoryStyle(category);

  const handleSend = async (text: string) => {
    if (!tenantConfig) return;

    const isFirstTurn = messages.length === 0;

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

    let buffer = "";
    try {
      for await (const chunk of streamChat({
        tenantSlug: tenant,
        systemPrompt: tenantConfig.systemPrompt,
        messages: history,
        signal: controller.signal,
      })) {
        if (controller.signal.aborted) break;
        buffer += chunk;
        setMessageContent(assistantMsg.id, buffer);
        queryClient.setQueryData<Message[]>(["messages", id], () => listMessages(id));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Errore di rete";
      setMessageContent(assistantMsg.id, buffer || `⚠️ ${message}`);
      queryClient.setQueryData<Message[]>(["messages", id], () => listMessages(id));
    } finally {
      touchConversation(id);
      queryClient.invalidateQueries({ queryKey: ["conversations", tenant] });
      setStreaming(false);
      abortRef.current = null;
      AccessibilityInfo.announceForAccessibility(buffer || "Risposta completata");
    }
  };

  const handleSuggestion = (s: Suggestion) => {
    composerRef.current?.setText(s.q, { focus: true });
  };

  if (!tenantConfig) return null;

  const hasMessages = messages.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ComuneHeader
        variant="comune"
        tenant={tenantConfig}
        onBack={() => router.back()}
      />

      {hasMessages && conversation && (
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: C.bgSofter,
            borderBottomWidth: 1,
            borderBottomColor: C.borderSoft,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 13.5,
              color: C.ink,
              fontFamily: FONT_FAMILY_BOLD,
            }}
          >
            {conversation.title}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: C.textMuted,
              marginTop: 1,
              fontFamily: FONT_FAMILY,
            }}
          >
            <Text style={{ color: catStyle.accent, fontFamily: FONT_FAMILY_MEDIUM }}>
              {category}
            </Text>
            {" · "}
            {shortItalianTime(conversation.updatedAt)}
          </Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: hasMessages ? 18 : 0, paddingBottom: 8 }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        >
          {hasMessages ? (
            messages.map((m) => <MessageBubble key={m.id} message={m} />)
          ) : (
            <EmptyChat tenant={tenantConfig} onSuggestionPress={handleSuggestion} />
          )}
        </ScrollView>
        <Composer
          ref={composerRef}
          onSend={handleSend}
          disabled={streaming}
          placeholder={
            hasMessages ? "Continua la conversazione…" : "Scrivi la tua domanda al Comune…"
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
}
