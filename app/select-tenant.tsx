import { useMemo, useState } from "react";
import { FlatList, View, Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
import {
  C,
  FONT_FAMILY,
  FONT_FAMILY_BOLD,
  FONT_FAMILY_MEDIUM,
} from "@/design/tokens";
import { ComuneHeader } from "@/components/comune-header";
import { TrustRow } from "@/components/trust-row";
import { TenantRow } from "@/components/tenant-row";
import { SvgIcon } from "@/components/icons/svg-icon";
import { tenants, type Tenant } from "@/tenants/config";
import { setStoredTenantSlug } from "@/tenants/storage";

export default function SelectTenant() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tenants;
    return tenants.filter((t) => t.name.toLowerCase().includes(q));
  }, [query]);

  const handlePick = async (tenant: Tenant) => {
    await setStoredTenantSlug(tenant.slug);
    router.replace(`/${tenant.slug}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ComuneHeader variant="logo" />
      <FlatList
        data={filtered}
        keyExtractor={(t) => t.slug}
        renderItem={({ item, index }) => (
          <View style={{ paddingHorizontal: 8 }}>
            <TenantRow
              tenant={item}
              onPress={handlePick}
              showBottomBorder={index < filtered.length - 1}
            />
          </View>
        )}
        ListHeaderComponent={
          <View>
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 28,
                paddingBottom: 24,
                backgroundColor: C.bgSoft,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: C.blue,
                  fontFamily: FONT_FAMILY_BOLD,
                  letterSpacing: 1.1,
                }}
              >
                BENVENUTO
              </Text>
              <Text
                accessibilityRole="header"
                accessibilityLanguage="it-IT"
                style={{
                  fontSize: 26,
                  color: C.ink,
                  fontFamily: FONT_FAMILY_BOLD,
                  marginTop: 6,
                  marginBottom: 10,
                  lineHeight: 30,
                  letterSpacing: -0.4,
                }}
              >
                Scegli il tuo Comune per iniziare
              </Text>
              <Text
                accessibilityLanguage="it-IT"
                style={{
                  fontSize: 14.5,
                  color: C.textMuted,
                  lineHeight: 22,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Fai domande sui servizi, le scadenze e i regolamenti del tuo
                Comune. Nessuna registrazione richiesta.
              </Text>
              <TrustRow />
            </View>

            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Cerca il tuo Comune"
                  placeholderTextColor={C.textMuted}
                  accessibilityLabel="Cerca il tuo Comune"
                  accessibilityLanguage="it-IT"
                  style={{
                    paddingVertical: 14,
                    paddingLeft: 44,
                    paddingRight: 14,
                    fontSize: 15.5,
                    fontFamily: FONT_FAMILY,
                    backgroundColor: "#FFFFFF",
                    borderWidth: 2,
                    borderColor: C.blue,
                    borderRadius: 4,
                    color: C.ink,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    left: 14,
                    top: 14,
                  }}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                >
                  <SvgIcon name="search" size={18} color={C.blue} strokeWidth={2} />
                </View>
              </View>
            </View>

            <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  backgroundColor: C.locationBg,
                  borderWidth: 1,
                  borderColor: C.borderSoft,
                  borderLeftWidth: 3,
                  borderLeftColor: C.blue,
                  borderRadius: 2,
                }}
              >
                <SvgIcon name="location" size={20} color={C.blue} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 13.5,
                      color: C.ink,
                      fontFamily: FONT_FAMILY_MEDIUM,
                    }}
                  >
                    Trova in base alla posizione
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: C.textMuted,
                      marginTop: 1,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    Permetti l'accesso alla posizione
                  </Text>
                </View>
                <SvgIcon name="chev" size={16} color={C.textMuted} />
              </View>
            </View>

            <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: C.textMuted,
                  fontFamily: FONT_FAMILY_BOLD,
                  letterSpacing: 0.8,
                }}
              >
                COMUNI IN PUGLIA · A–B
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <Text
            accessibilityLanguage="it-IT"
            style={{
              paddingHorizontal: 20,
              paddingTop: 24,
              paddingBottom: 32,
              textAlign: "center",
              fontSize: 11.5,
              color: C.textFaint,
              lineHeight: 18,
              fontFamily: FONT_FAMILY,
            }}
          >
            Comuni AI è un servizio informativo. {"\n"}Per pratiche ufficiali rivolgersi sempre allo sportello comunale.
          </Text>
        }
      />
    </View>
  );
}
