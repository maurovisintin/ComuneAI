import { useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";

import { findTenant } from "@/tenants/config";
import { storiesFor } from "@/stories/config";
import { TenantUIContext, type TenantUIContextValue } from "@/context/tenant-ui";
import { Drawer } from "@/components/overlays/drawer";
import { VoiceOverlay } from "@/components/overlays/voice-overlay";
import { StoryViewer } from "@/components/overlays/story-viewer";

export default function TenantLayout() {
  const { tenant } = useLocalSearchParams<{ tenant: string }>();
  const tenantConfig = findTenant(tenant);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [storiesOpen, setStoriesOpen] = useState(false);
  const voiceCallback = useRef<((text: string) => void) | null>(null);

  const value = useMemo<TenantUIContextValue>(
    () => ({
      openDrawer: () => setDrawerOpen(true),
      openVoice: (onResult) => {
        voiceCallback.current = onResult;
        setVoiceOpen(true);
      },
      openStories: () => setStoriesOpen(true),
    }),
    []
  );

  const stories = useMemo(
    () => (tenantConfig ? storiesFor(tenantConfig.name) : []),
    [tenantConfig]
  );

  if (!tenantConfig) {
    return <Redirect href="/select-tenant" />;
  }

  return (
    <TenantUIContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="c/[id]" />
          <Stack.Screen name="segnalazioni" />
        </Stack>
        <Drawer
          visible={drawerOpen}
          tenant={tenantConfig}
          onClose={() => setDrawerOpen(false)}
        />
        <VoiceOverlay
          visible={voiceOpen}
          onClose={() => setVoiceOpen(false)}
          onResult={(text) => voiceCallback.current?.(text)}
        />
        <StoryViewer
          visible={storiesOpen}
          stories={stories}
          onClose={() => setStoriesOpen(false)}
        />
      </View>
    </TenantUIContext.Provider>
  );
}
