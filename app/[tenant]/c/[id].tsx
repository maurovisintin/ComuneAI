import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { View } from "@/tw";
import { MessageList } from "@/components/chat/message-list";
import { Composer } from "@/components/chat/composer";
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

export default function ChatScreen() {
  const { tenant, id } = useLocalSearchParams<{ tenant: string; id: string }>();
  const queryClient = useQueryClient();
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

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
    if (!tenantConfig) return;

    const conversation = getConversation(id);
    const isFirstTurn = (messages.length ?? 0) === 0;

    insertMessage(id, "user", text);
    const assistantMsg = insertMessage(id, "assistant", "");
    queryClient.setQueryData<Message[]>(["messages", id], () =>
      listMessages(id)
    );

    if (isFirstTurn && conversation) {
      const title = text.slice(0, 40).trim();
      if (title) updateConversationTitle(id, title);
      queryClient.invalidateQueries({
        queryKey: ["conversations", tenant],
      });
    }

    const history: ChatMessage[] = [
      ...listMessages(id)
        .filter((m) => m.id !== assistantMsg.id)
        .map<ChatMessage>((m) => ({ role: m.role, content: m.content })),
    ];

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
        queryClient.setQueryData<Message[]>(["messages", id], () =>
          listMessages(id)
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Errore di rete";
      setMessageContent(
        assistantMsg.id,
        buffer || `⚠️ ${message}`
      );
      queryClient.setQueryData<Message[]>(["messages", id], () =>
        listMessages(id)
      );
    } finally {
      touchConversation(id);
      queryClient.invalidateQueries({ queryKey: ["conversations", tenant] });
      setStreaming(false);
      abortRef.current = null;
    }
  };

  return (
    <View className="flex-1 bg-app-bg">
      <Stack.Screen
        options={{ title: tenantConfig?.name ?? "Chat" }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 96 : 0}
        style={{ flex: 1 }}
      >
        <View className="flex-1">
          {messages.length === 0 ? (
            <EmptyChat tenantName={tenantConfig?.name ?? "Comune"} />
          ) : (
            <MessageList messages={messages} />
          )}
        </View>
        <Composer onSend={handleSend} disabled={streaming} />
      </KeyboardAvoidingView>
    </View>
  );
}
