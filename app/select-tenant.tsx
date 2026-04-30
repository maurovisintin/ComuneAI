import { FlatList } from "react-native";
import { Stack, useRouter } from "expo-router";

import { View, Text } from "@/tw";
import { TenantRow } from "@/components/tenant-row";
import { tenants, type Tenant } from "@/tenants/config";
import { setStoredTenantSlug } from "@/tenants/storage";

export default function SelectTenant() {
  const router = useRouter();

  const handlePick = async (tenant: Tenant) => {
    await setStoredTenantSlug(tenant.slug);
    router.replace(`/${tenant.slug}`);
  };

  return (
    <View className="flex-1 bg-app-bg">
      <Stack.Screen
        options={{
          title: "Scegli il tuo Comune",
          headerLargeTitle: true,
        }}
      />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={tenants}
        keyExtractor={(t) => t.slug}
        renderItem={({ item }) => (
          <TenantRow tenant={item} onPress={handlePick} />
        )}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-app-separator ml-16" />
        )}
        ListHeaderComponent={
          <View className="px-4 pt-2 pb-4">
            <Text className="text-app-text-2 text-base">
              Seleziona il Comune con cui vuoi chattare. Potrai cambiarlo in
              qualsiasi momento.
            </Text>
          </View>
        }
      />
    </View>
  );
}
