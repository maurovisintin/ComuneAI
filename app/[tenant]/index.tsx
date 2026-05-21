import { useMemo, useState } from "react";
import { FlatList, Pressable, TextInput, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  C,
  FONT_FAMILY,
  FONT_FAMILY_BOLD,
  FONT_FAMILY_MEDIUM,
} from "@/design/tokens";
import { ComuneHeader } from "@/components/comune-header";
import { ConversationRow } from "@/components/conversation-row";
import { SvgIcon } from "@/components/icons/svg-icon";
import {
  createConversation,
  listConversations,
  type Conversation,
} from "@/db/queries";
import { findTenant } from "@/tenants/config";
import { clearStoredTenantSlug } from "@/tenants/storage";
import { groupConversations } from "@/utils/group-conversations";

type Row =
  | { kind: "section"; key: string; section: string }
  | { kind: "item"; key: string; conversation: Conversation };

export default function ConversationListScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const { tenant } = useLocalSearchParams<{ tenant: string }>();
  const tenantConfig = findTenant(tenant);

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["conversations", tenant],
    queryFn: () => listConversations(tenant),
  });

  const [query, setQuery] = useState("");

  const rows: Row[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? conversations.filter((c) => c.title.toLowerCase().includes(q))
      : conversations;
    const groups = groupConversations(filtered);
    const out: Row[] = [];
    for (const g of groups) {
      out.push({ kind: "section", key: `s:${g.section}`, section: g.section });
      for (const c of g.items) {
        out.push({ kind: "item", key: c.id, conversation: c });
      }
    }
    return out;
  }, [conversations, query]);

  const handleNewChat = () => {
    const conv = createConversation(tenant);
    queryClient.invalidateQueries({ queryKey: ["conversations", tenant] });
    router.push(`/${tenant}/c/${conv.id}`);
  };

  const handleSwitchTenant = async () => {
    await clearStoredTenantSlug();
    router.replace("/select-tenant");
  };

  if (!tenantConfig) return null;

  return (
    <View style={{ flex: 1, backgroundColor: C.bgSoft }}>
      <ComuneHeader variant="comune" tenant={tenantConfig} onMenu={handleSwitchTenant} />

      <FlatList
        data={rows}
        keyExtractor={(r) => r.key}
        ListHeaderComponent={
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 12,
              backgroundColor: C.bg,
              borderBottomWidth: 1,
              borderBottomColor: C.borderSoft,
            }}
          >
            <Text
              accessibilityRole="header"
              accessibilityLanguage="it-IT"
              style={{
                fontSize: 24,
                color: C.ink,
                fontFamily: FONT_FAMILY_BOLD,
                letterSpacing: -0.4,
              }}
            >
              Le tue conversazioni
            </Text>
            <Text
              accessibilityLanguage="it-IT"
              style={{
                fontSize: 13,
                color: C.textMuted,
                marginTop: 4,
                marginBottom: 14,
                fontFamily: FONT_FAMILY,
              }}
            >
              Salvate localmente su questo dispositivo · {conversations.length}{" "}
              {conversations.length === 1 ? "conversazione" : "conversazioni"}
            </Text>
            <View style={{ position: "relative" }}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Cerca nelle conversazioni"
                placeholderTextColor={C.textMuted}
                accessibilityLabel="Cerca nelle conversazioni"
                accessibilityLanguage="it-IT"
                style={{
                  paddingVertical: 11,
                  paddingLeft: 40,
                  paddingRight: 14,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY,
                  backgroundColor: C.bgSoft,
                  borderWidth: 1,
                  borderColor: C.borderSoft,
                  borderRadius: 4,
                  color: C.text,
                }}
              />
              <View
                style={{ position: "absolute", left: 12, top: 12 }}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <SvgIcon name="search" size={16} color={C.textMuted} />
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          if (item.kind === "section") {
            return (
              <View
                style={{
                  paddingTop: 16,
                  paddingBottom: 6,
                  paddingHorizontal: 20,
                  backgroundColor: C.bgSoft,
                }}
              >
                <Text
                  accessibilityRole="header"
                  accessibilityLanguage="it-IT"
                  style={{
                    fontSize: 11,
                    color: C.textMuted,
                    fontFamily: FONT_FAMILY_BOLD,
                    letterSpacing: 0.8,
                  }}
                >
                  {item.section.toUpperCase()}
                </Text>
              </View>
            );
          }
          return (
            <ConversationRow conversation={item.conversation} tenantSlug={tenant} />
          );
        }}
        ListEmptyComponent={
          <View
            style={{
              paddingHorizontal: 32,
              paddingVertical: 48,
              alignItems: "center",
              gap: 12,
              backgroundColor: C.bg,
            }}
          >
            <Text
              accessibilityRole="header"
              accessibilityLanguage="it-IT"
              style={{
                fontSize: 20,
                color: C.ink,
                fontFamily: FONT_FAMILY_BOLD,
                textAlign: "center",
              }}
            >
              Nessuna conversazione
            </Text>
            <Text
              accessibilityLanguage="it-IT"
              style={{
                fontSize: 14,
                color: C.textMuted,
                textAlign: "center",
                lineHeight: 20,
                fontFamily: FONT_FAMILY,
              }}
            >
              Tocca "Nuova conversazione" in basso per iniziare a chattare con
              l'assistente del Comune.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
      />

      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: Math.max(insets.bottom, 16) + 8,
        }}
      >
        <Pressable
          onPress={handleNewChat}
          accessibilityRole="button"
          accessibilityLabel="Nuova conversazione"
          accessibilityHint="Apre una nuova conversazione con il Comune"
          accessibilityLanguage="it-IT"
          style={({ pressed }) => ({
            backgroundColor: pressed ? C.blueDark : C.blue,
            paddingVertical: 14,
            paddingHorizontal: 18,
            borderRadius: 4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            shadowColor: C.blue,
            shadowOpacity: 0.32,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 24,
            elevation: 6,
          })}
        >
          <SvgIcon name="plus" size={18} color="#FFFFFF" strokeWidth={2.2} />
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 15,
              fontFamily: FONT_FAMILY_MEDIUM,
            }}
          >
            Nuova conversazione
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
