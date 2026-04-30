import { Redirect, Stack, useLocalSearchParams } from "expo-router";

import { findTenant } from "@/tenants/config";

export default function TenantLayout() {
  const { tenant } = useLocalSearchParams<{ tenant: string }>();
  const tenantConfig = findTenant(tenant);

  if (!tenantConfig) {
    return <Redirect href="/select-tenant" />;
  }

  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="index" options={{ title: tenantConfig.name }} />
      <Stack.Screen name="c/[id]" options={{ title: "Chat" }} />
    </Stack>
  );
}
