import { FlatList } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { View, Text, Pressable } from "@/tw";
import { ConversationRow } from "@/components/conversation-row";
import {
  createConversation,
  listConversations,
  type Conversation,
} from "@/db/queries";
import { findTenant } from "@/tenants/config";
import { clearStoredTenantSlug } from "@/tenants/storage";

export default function ConversationListScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { tenant } = useLocalSearchParams<{ tenant: string }>();
  const tenantConfig = findTenant(tenant);

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["conversations", tenant],
    queryFn: () => listConversations(tenant),
  });

  const handleNewChat = () => {
    const conversation = createConversation(tenant);
    queryClient.invalidateQueries({ queryKey: ["conversations", tenant] });
    router.push(`/${tenant}/c/${conversation.id}`);
  };

  const handleSwitchTenant = async () => {
    await clearStoredTenantSlug();
    router.replace("/select-tenant");
  };

  return (
    <View className="flex-1 bg-app-bg">
      <Stack.Screen
        options={{
          title: tenantConfig?.name ?? "Comune",
          headerLargeTitle: true,
          headerRight: () => (
            <Pressable onPress={handleNewChat} hitSlop={12}>
              <Text
                className="text-app-tint font-semibold"
                style={{ fontSize: 22, lineHeight: 24 }}
              >
                +
              </Text>
            </Pressable>
          ),
          headerLeft: () => (
            <Pressable onPress={handleSwitchTenant} hitSlop={12}>
              <Text className="text-app-tint text-base">Cambia</Text>
            </Pressable>
          ),
        }}
      />

      {conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8 gap-3">
          <Text
            className="text-app-text font-semibold text-center"
            style={{ fontSize: 20, lineHeight: 26 }}
          >
            Nessuna conversazione
          </Text>
          <Text className="text-app-text-2 text-base text-center">
            Tocca il + in alto a destra per iniziare a chattare con
            l'assistente del Comune.
          </Text>
          <Pressable
            onPress={handleNewChat}
            className="mt-2 rounded-full bg-app-tint px-6 py-3"
            style={{ borderCurve: "continuous" }}
          >
            <Text className="text-white font-semibold text-base">
              Nuova chat
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={conversations}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <ConversationRow conversation={item} tenantSlug={tenant} />
          )}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-app-separator ml-4" />
          )}
        />
      )}
    </View>
  );
}
