import { View, Text } from "@/tw";

export function EmptyChat({ tenantName }: { tenantName: string }) {
  return (
    <View className="flex-1 items-center justify-center px-8 gap-2">
      <Text
        className="text-app-text font-semibold text-center"
        style={{ fontSize: 22, lineHeight: 28 }}
      >
        Ciao
      </Text>
      <Text className="text-app-text-2 text-base text-center">
        Sono l'assistente di {tenantName}. Chiedimi qualcosa sui servizi del
        Comune.
      </Text>
    </View>
  );
}
