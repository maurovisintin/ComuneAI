import { Pressable, Text, View } from "@/tw";
import { useRouter } from "expo-router";
import type { Conversation } from "@/db/queries";

function relativeItalian(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Adesso";
  if (diff < hour) return `${Math.floor(diff / minute)} min fa`;
  if (diff < day) return `${Math.floor(diff / hour)} ore fa`;
  if (diff < 2 * day) return "Ieri";
  if (diff < 7 * day) return `${Math.floor(diff / day)} giorni fa`;
  return new Date(timestamp).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
  });
}

export function ConversationRow({
  conversation,
  tenantSlug,
}: {
  conversation: Conversation;
  tenantSlug: string;
}) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/${tenantSlug}/c/${conversation.id}`)}
      className="px-4 py-3 active:bg-app-bg-2"
    >
      <View className="flex-row items-center gap-3">
        <View className="flex-1 gap-1">
          <Text
            className="text-app-text text-base font-medium"
            numberOfLines={1}
          >
            {conversation.title}
          </Text>
          <Text className="text-app-text-2 text-sm">
            {relativeItalian(conversation.updatedAt)}
          </Text>
        </View>
        <Text
          className="text-app-text-2"
          style={{ fontSize: 20, lineHeight: 22 }}
        >
          ›
        </Text>
      </View>
    </Pressable>
  );
}
