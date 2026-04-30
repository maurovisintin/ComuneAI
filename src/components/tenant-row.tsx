import { Pressable, Text, View } from "@/tw";
import type { Tenant } from "@/tenants/config";

type Props = {
  tenant: Tenant;
  onPress: (tenant: Tenant) => void;
};

export function TenantRow({ tenant, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(tenant)}
      className="px-4 py-4 active:bg-app-bg-2"
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-10 w-10 rounded-full bg-app-bg-2 items-center justify-center"
          style={{ borderCurve: "continuous" }}
        >
          <Text
            className="text-app-text font-semibold"
            style={{ fontSize: 16, lineHeight: 18 }}
          >
            {tenant.slug.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="flex-1 gap-0.5">
          <Text className="text-app-text text-base font-medium">
            {tenant.name}
          </Text>
          <Text className="text-app-text-2 text-sm">/{tenant.slug}</Text>
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
