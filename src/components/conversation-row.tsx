import { Pressable, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { C, FONT_FAMILY_BOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY } from "@/design/tokens";
import { CategoryIconTile } from "@/components/category-icon-tile";
import { categoryStyle } from "@/utils/categorise";
import { shortItalianTime } from "@/utils/group-conversations";
import type { Conversation } from "@/db/queries";

export function ConversationRow({
  conversation,
  tenantSlug,
}: {
  conversation: Conversation;
  tenantSlug: string;
}) {
  const router = useRouter();
  const cat = conversation.category ?? "Generale";
  const style = categoryStyle(cat);
  const time = shortItalianTime(conversation.updatedAt);

  return (
    <Pressable
      onPress={() => router.push(`/${tenantSlug}/c/${conversation.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${conversation.title}, ${cat}, ${time}`}
      accessibilityLanguage="it-IT"
      style={({ pressed }) => ({
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: pressed ? C.bgSoft : "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: C.borderSoft,
        flexDirection: "row",
        gap: 12,
        alignItems: "flex-start",
      })}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <CategoryIconTile category={cat} />
      </View>
      <View
        style={{ flex: 1, minWidth: 0 }}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Text
          numberOfLines={2}
          style={{
            fontSize: 14.5,
            color: C.ink,
            fontFamily: FONT_FAMILY_MEDIUM,
            lineHeight: 20,
          }}
        >
          {conversation.title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3, gap: 6 }}>
          <Text style={{ fontSize: 12, color: style.accent, fontFamily: FONT_FAMILY_BOLD }}>
            {cat}
          </Text>
          <Text style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT_FAMILY }}>·</Text>
          <Text style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT_FAMILY }}>{time}</Text>
        </View>
      </View>
    </Pressable>
  );
}
