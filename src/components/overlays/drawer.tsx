import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";

import { C, FONT } from "@/design/tokens";
import { BrandGradient } from "@/components/brand-gradient";
import { Icon, type IconName } from "@/components/icons/icon";
import { listConversations, type Conversation } from "@/db/queries";
import type { Tenant } from "@/tenants/config";
import { clearStoredTenantSlug } from "@/tenants/storage";
import { groupConversations } from "@/utils/group-conversations";

const HISTORY_PREVIEW = 4;

function DrawerRow({
  icon,
  iconColor = C.fg2,
  iconBg,
  label,
  labelStyle,
  right,
  chevron,
  onPress,
}: {
  icon: IconName;
  iconColor?: string;
  iconBg?: string;
  label: string;
  labelStyle?: object;
  right?: React.ReactNode;
  chevron?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityLanguage="it-IT"
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 13,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: pressed ? C.sunken : "transparent",
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: iconBg ? 10 : 0,
          backgroundColor: iconBg ?? "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={iconBg ? 20 : 21} color={iconColor} />
      </View>
      <Text
        style={[
          { flex: 1, fontFamily: FONT.medium, fontSize: 15, color: C.fg1 },
          labelStyle,
        ]}
      >
        {label}
      </Text>
      {right}
      {chevron && <Icon name="chevron-right" size={20} color={C.ink300} />}
    </Pressable>
  );
}

function ConversationRow({
  conversation,
  compact,
  onPress,
}: {
  conversation: Conversation;
  compact?: boolean;
  onPress: () => void;
}) {
  const cat = conversation.category ?? "Generale";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Conversazione: ${conversation.title}, ${cat}`}
      accessibilityLanguage="it-IT"
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 13,
        paddingVertical: 11,
        paddingHorizontal: compact ? 14 : 8,
        borderRadius: 12,
        backgroundColor: pressed ? C.sunken : "transparent",
      })}
    >
      <View
        style={{
          width: compact ? 36 : 38,
          height: compact ? 36 : 38,
          borderRadius: compact ? 10 : 11,
          backgroundColor: compact ? C.sunken : C.accSoft,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="message-square" size={18} color={C.accInk} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: FONT.semibold,
            fontSize: compact ? 14.5 : 15,
            color: C.fg1,
          }}
        >
          {conversation.title}
        </Text>
        <Text
          style={{
            fontFamily: FONT.medium,
            fontSize: compact ? 12 : 12.5,
            color: C.fg4,
            marginTop: 2,
          }}
        >
          {cat}
        </Text>
      </View>
      {!compact && <Icon name="chevron-right" size={20} color={C.ink300} />}
    </Pressable>
  );
}

type Props = {
  visible: boolean;
  tenant: Tenant;
  onClose: () => void;
};

/** Right-side app drawer: new chat, history, settings, cambia Comune. */
export function Drawer({ visible, tenant, onClose }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [histQ, setHistQ] = useState("");

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["conversations", tenant.slug],
    queryFn: () => listConversations(tenant.slug),
    enabled: visible,
  });

  if (!visible) return null;

  const close = () => {
    setHistoryOpen(false);
    setHistQ("");
    onClose();
  };

  const openConversation = (id: string) => {
    close();
    router.push(`/${tenant.slug}/c/${id}`);
  };

  const q = histQ.trim().toLowerCase();
  const filtered = q
    ? conversations.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.category ?? "").toLowerCase().includes(q)
      )
    : conversations;
  const groups = groupConversations(filtered);

  return (
    <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 60 }}>
      <Animated.View
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(200)}
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(14,23,38,0.42)",
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Chiudi il menu"
          accessibilityLanguage="it-IT"
        />
      </Animated.View>

      <Animated.View
        entering={SlideInRight.duration(300)}
        exiting={SlideOutRight.duration(250)}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 320,
          maxWidth: "88%",
          backgroundColor: C.card,
          overflow: "hidden",
        }}
      >
        {/* gradient header */}
        <BrandGradient
          style={{
            paddingTop: insets.top + 18,
            paddingHorizontal: 22,
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              backgroundColor: "rgba(255,255,255,0.22)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Icon name="landmark" size={26} color="#FFFFFF" />
          </View>
          <Text
            style={{
              fontFamily: FONT.medium,
              fontSize: 13,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Comune di
          </Text>
          <Text
            style={{
              fontFamily: FONT.bold,
              fontSize: 19,
              color: "#FFFFFF",
              marginTop: 2,
            }}
          >
            {tenant.name}
          </Text>
        </BrandGradient>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 12,
            paddingBottom: insets.bottom + 24,
          }}
        >
          <DrawerRow
            icon="plus"
            iconColor={C.accInk}
            iconBg={C.accSoft}
            label="Nuova conversazione"
            labelStyle={{ fontFamily: FONT.semibold, fontSize: 15.5 }}
            onPress={() => {
              close();
              router.navigate(`/${tenant.slug}`);
            }}
          />

          <Text
            accessibilityRole="header"
            accessibilityLanguage="it-IT"
            style={{
              fontFamily: FONT.bold,
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: C.fg4,
              paddingTop: 18,
              paddingHorizontal: 14,
              paddingBottom: 8,
            }}
          >
            Storico conversazioni
          </Text>
          {conversations.slice(0, HISTORY_PREVIEW).map((c) => (
            <ConversationRow
              key={c.id}
              conversation={c}
              compact
              onPress={() => openConversation(c.id)}
            />
          ))}
          {conversations.length === 0 && (
            <Text
              accessibilityLanguage="it-IT"
              style={{
                fontFamily: FONT.medium,
                fontSize: 13,
                color: C.fg4,
                paddingHorizontal: 14,
                paddingVertical: 6,
              }}
            >
              Nessuna conversazione ancora.
            </Text>
          )}
          {conversations.length > HISTORY_PREVIEW && (
            <Pressable
              onPress={() => setHistoryOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Mostra tutte le conversazioni"
              accessibilityLanguage="it-IT"
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 13,
                paddingVertical: 11,
                paddingHorizontal: 14,
                borderRadius: 12,
                backgroundColor: pressed ? C.sunken : "transparent",
              })}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: C.accSoft,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="clock" size={19} color={C.accInk} />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontFamily: FONT.bold,
                  fontSize: 14.5,
                  color: C.accInk,
                }}
              >
                Mostra tutte le conversazioni
              </Text>
              <Icon name="chevron-right" size={20} color={C.ink300} />
            </Pressable>
          )}

          <View
            style={{
              height: 1,
              backgroundColor: C.hairline,
              marginVertical: 14,
              marginHorizontal: 14,
            }}
          />

          <DrawerRow
            icon="globe"
            label="Lingua"
            right={
              <Text
                style={{ fontFamily: FONT.semibold, fontSize: 13, color: C.accInk }}
              >
                IT · EN
              </Text>
            }
          />
          <DrawerRow
            icon="flag"
            label="Le mie segnalazioni"
            chevron
            onPress={() => {
              close();
              router.push(`/${tenant.slug}/segnalazioni`);
            }}
          />
          <DrawerRow icon="shield-check" label="Privacy e fonti" chevron />
          <DrawerRow icon="help-circle" label="Aiuto" chevron />
          <DrawerRow
            icon="map-pin"
            label="Cambia Comune"
            chevron
            onPress={async () => {
              close();
              await clearStoredTenantSlug();
              router.replace("/select-tenant");
            }}
          />
        </ScrollView>

        {/* full history sub-panel */}
        {historyOpen && (
          <Animated.View
            entering={SlideInRight.duration(280)}
            exiting={SlideOutRight.duration(240)}
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: C.card,
              zIndex: 2,
            }}
          >
            <View
              style={{
                paddingTop: insets.top + 10,
                paddingHorizontal: 12,
                paddingBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                borderBottomWidth: 1,
                borderBottomColor: C.hairline,
              }}
            >
              <Pressable
                onPress={() => {
                  setHistoryOpen(false);
                  setHistQ("");
                }}
                accessibilityRole="button"
                accessibilityLabel="Indietro"
                accessibilityLanguage="it-IT"
                style={({ pressed }) => ({
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [{ scale: pressed ? 0.9 : 1 }],
                })}
              >
                <Icon name="arrow-left" size={22} color={C.fg1} />
              </Pressable>
              <Text
                accessibilityRole="header"
                accessibilityLanguage="it-IT"
                style={{ fontFamily: FONT.bold, fontSize: 18, color: C.fg1 }}
              >
                Conversazioni
              </Text>
            </View>

            <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  backgroundColor: C.sunken,
                  borderRadius: 999,
                  height: 44,
                  paddingHorizontal: 16,
                }}
              >
                <Icon name="search" size={20} color={C.fg4} />
                <TextInput
                  value={histQ}
                  onChangeText={setHistQ}
                  placeholder="Cerca nelle conversazioni"
                  placeholderTextColor={C.fg4}
                  accessibilityLabel="Cerca nelle conversazioni"
                  accessibilityLanguage="it-IT"
                  style={{
                    flex: 1,
                    fontFamily: FONT.regular,
                    fontSize: 15,
                    color: C.fg1,
                    paddingVertical: 0,
                  }}
                />
              </View>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 12,
                paddingTop: 8,
                paddingBottom: insets.bottom + 24,
              }}
            >
              {groups.map((g) => (
                <View key={g.section}>
                  <Text
                    accessibilityRole="header"
                    accessibilityLanguage="it-IT"
                    style={{
                      fontFamily: FONT.bold,
                      fontSize: 11,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: C.fg4,
                      paddingTop: 14,
                      paddingHorizontal: 8,
                      paddingBottom: 6,
                    }}
                  >
                    {g.section}
                  </Text>
                  {g.items.map((c) => (
                    <ConversationRow
                      key={c.id}
                      conversation={c}
                      onPress={() => openConversation(c.id)}
                    />
                  ))}
                </View>
              ))}
              {q !== "" && filtered.length === 0 && (
                <Text
                  accessibilityLanguage="it-IT"
                  style={{
                    fontFamily: FONT.medium,
                    fontSize: 14,
                    color: C.fg4,
                    textAlign: "center",
                    marginTop: 24,
                  }}
                >
                  Nessuna conversazione trovata.
                </Text>
              )}
            </ScrollView>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}
