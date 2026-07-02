import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { C, FONT } from "@/design/tokens";
import { BrandGradient } from "@/components/brand-gradient";
import { LogoPin } from "@/components/icons/logo-mark";
import { Icon } from "@/components/icons/icon";
import {
  DEFAULT_TENANT_SLUG,
  searchTenants,
  type Tenant,
} from "@/tenants/config";
import { setStoredTenantSlug } from "@/tenants/storage";

export default function SelectTenantScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const results = searchTenants(trimmed);

  const pick = async (slug: string) => {
    await setStoredTenantSlug(slug);
    router.replace(`/${slug}`);
  };

  const submitFirst = () => {
    if (results.length > 0) pick(results[0].slug);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: C.card }}
    >
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 28,
          paddingTop: insets.top,
        }}
      >
        <View style={{ height: trimmed ? 40 : 96 }} />
        <LogoPin size={84} />

        <Text
          accessibilityRole="header"
          accessibilityLanguage="it-IT"
          style={{
            fontFamily: FONT.extrabold,
            fontSize: 28,
            lineHeight: 33,
            letterSpacing: -0.6,
            color: C.fg1,
            textAlign: "center",
            marginTop: 24,
          }}
        >
          Di quale Comune{"\n"}fai parte?
        </Text>
        <Text
          accessibilityLanguage="it-IT"
          style={{
            fontFamily: FONT.regular,
            fontSize: 16,
            lineHeight: 24,
            color: C.fg3,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Cerca il tuo Comune per iniziare.
        </Text>

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: C.card,
            borderWidth: 1.5,
            borderColor: C.stroke,
            borderRadius: 999,
            height: 54,
            paddingLeft: 20,
            paddingRight: 5,
            marginTop: 26,
          }}
        >
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={submitFirst}
            placeholder="Scrivi il nome del Comune…"
            placeholderTextColor={C.fg4}
            returnKeyType="search"
            accessibilityLabel="Cerca il tuo Comune"
            accessibilityLanguage="it-IT"
            style={{
              flex: 1,
              fontFamily: FONT.regular,
              fontSize: 16,
              color: C.fg1,
              paddingVertical: 0,
            }}
          />
          <BrandGradient
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="search" size={21} color="#FFFFFF" />
          </BrandGradient>
        </View>

        {trimmed === "" ? (
          <>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginTop: 18,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: C.stroke }} />
              <Text
                accessibilityLanguage="it-IT"
                style={{ fontFamily: FONT.semibold, fontSize: 13, color: C.fg4 }}
              >
                Oppure
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: C.stroke }} />
            </View>
            <Pressable
              onPress={() => pick(DEFAULT_TENANT_SLUG)}
              accessibilityRole="button"
              accessibilityLabel="Usa la mia posizione"
              accessibilityLanguage="it-IT"
              style={({ pressed }) => ({
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                height: 54,
                borderRadius: 999,
                borderWidth: 1.5,
                borderColor: C.stroke,
                backgroundColor: C.card,
                marginTop: 18,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Icon name="map-pin" size={20} color={C.accInk} />
              <Text style={{ fontFamily: FONT.bold, fontSize: 16, color: C.fg1 }}>
                Usa la mia posizione
              </Text>
            </Pressable>
          </>
        ) : (
          <ScrollView
            style={{ flex: 1, width: "100%", marginTop: 14 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
            showsVerticalScrollIndicator={false}
          >
            {results.map((t: Tenant) => (
              <Pressable
                key={t.slug}
                onPress={() => pick(t.slug)}
                accessibilityRole="button"
                accessibilityLabel={`Comune di ${t.name}, ${t.region}, ${t.provinceLabel}`}
                accessibilityLanguage="it-IT"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 13,
                  paddingVertical: 13,
                  paddingHorizontal: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: C.hairline,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    backgroundColor: C.accSoft,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="compass" size={22} color={C.accInk} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontFamily: FONT.bold, fontSize: 16, color: C.fg1 }}
                  >
                    Comune di {t.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONT.medium,
                      fontSize: 12.5,
                      color: C.fg3,
                      marginTop: 2,
                    }}
                  >
                    {t.region} · {t.provinceLabel}
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={C.ink300} />
              </Pressable>
            ))}
            {results.length === 0 && (
              <Text
                accessibilityLanguage="it-IT"
                style={{
                  fontFamily: FONT.medium,
                  fontSize: 14,
                  lineHeight: 20,
                  color: C.fg4,
                  textAlign: "center",
                  marginTop: 18,
                }}
              >
                Nessun Comune trovato. Prova con un altro nome.
              </Text>
            )}
          </ScrollView>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
