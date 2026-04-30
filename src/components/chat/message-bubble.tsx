import { View, Text } from "@/tw";
import type { Message } from "@/db/queries";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (!isUser) {
    return (
      <View className="px-4 py-2">
        <Text selectable className="text-app-text text-base">
          {message.content || "…"}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row justify-end px-4 py-1">
      <View
        className="max-w-[80%] rounded-3xl bg-bubble-user px-4 py-2.5"
        style={{ borderCurve: "continuous", borderBottomRightRadius: 6 }}
      >
        <Text
          selectable
          className="text-bubble-user-text text-base"
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
}
