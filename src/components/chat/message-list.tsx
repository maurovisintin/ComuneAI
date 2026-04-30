import { FlatList } from "react-native";
import { MessageBubble } from "./message-bubble";
import type { Message } from "@/db/queries";

export function MessageList({ messages }: { messages: Message[] }) {
  const reversed = [...messages].reverse();

  return (
    <FlatList
      data={reversed}
      keyExtractor={(m) => m.id}
      renderItem={({ item }) => <MessageBubble message={item} />}
      inverted
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 8, gap: 6 }}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
    />
  );
}
