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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { C, FONT } from "@/design/tokens";
import { BrandGradient } from "@/components/brand-gradient";
import { Icon } from "@/components/icons/icon";
import { useTenantUI } from "@/context/tenant-ui";
import { createReport, listReports, type Report } from "@/db/queries";
import { findTenant } from "@/tenants/config";
import {
  findReportCategory,
  REPORT_CATEGORIES,
  reportBadgeColors,
} from "@/reports/config";
import { shortItalianTime } from "@/utils/group-conversations";

type Step = "list" | "cat" | "form" | "done";

function Header({
  title,
  eyebrow,
  onBack,
  onMenu,
  topInset,
}: {
  title: string;
  eyebrow?: string;
  onBack: () => void;
  onMenu?: () => void;
  topInset: number;
}) {
  return (
    <View
      style={{
        paddingTop: topInset + 8,
        paddingHorizontal: 14,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: C.hairline,
      }}
    >
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Indietro"
        accessibilityLanguage="it-IT"
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="arrow-left" size={22} color={C.fg1} />
      </Pressable>
      <View style={{ flex: 1 }}>
        {eyebrow ? (
          <Text
            accessibilityLanguage="it-IT"
            style={{
              fontFamily: FONT.bold,
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: C.accInk,
            }}
          >
            {eyebrow}
          </Text>
        ) : null}
        <Text
          accessibilityRole="header"
          accessibilityLanguage="it-IT"
          style={{ fontFamily: FONT.bold, fontSize: 19, color: C.fg1 }}
        >
          {title}
        </Text>
      </View>
      {onMenu && (
        <Pressable
          onPress={onMenu}
          accessibilityRole="button"
          accessibilityLabel="Apri il menu"
          accessibilityLanguage="it-IT"
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="menu" size={24} color={C.fg2} />
        </Pressable>
      )}
    </View>
  );
}

export default function SegnalazioniScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const { tenant } = useLocalSearchParams<{ tenant: string }>();
  const tenantConfig = findTenant(tenant);
  const { openDrawer } = useTenantUI();

  const [step, setStep] = useState<Step>("list");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [text, setText] = useState("");

  const { data: reports = [] } = useQuery<Report[]>({
    queryKey: ["reports", tenant],
    queryFn: () => listReports(tenant),
  });

  if (!tenantConfig) return null;

  const submit = () => {
    const cat = findReportCategory(categoryId ?? "altro");
    const label = text.trim() || cat.label;
    createReport(tenant, cat.id, label);
    queryClient.invalidateQueries({ queryKey: ["reports", tenant] });
    setStep("done");
  };

  const resetToList = () => {
    setStep("list");
    setCategoryId(null);
    setText("");
  };

  if (step === "done") {
    return (
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{
          flex: 1,
          backgroundColor: C.card,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 34,
        }}
      >
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: C.okBg,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <Icon name="check" size={48} color={C.ok} strokeWidth={2.6} />
        </View>
        <Text
          accessibilityRole="header"
          accessibilityLanguage="it-IT"
          style={{
            fontFamily: FONT.bold,
            fontSize: 26,
            color: C.fg1,
            marginBottom: 10,
          }}
        >
          Segnalazione inviata
        </Text>
        <Text
          accessibilityLanguage="it-IT"
          style={{
            fontFamily: FONT.regular,
            fontSize: 16,
            lineHeight: 24,
            color: C.fg2,
            textAlign: "center",
            maxWidth: 300,
            marginBottom: 30,
          }}
        >
          Grazie! Il Comune l'ha ricevuta: ti scrivo qui appena cambia stato.
        </Text>
        <Pressable
          onPress={resetToList}
          accessibilityRole="button"
          accessibilityLabel="Torna alle segnalazioni"
          accessibilityLanguage="it-IT"
          style={({ pressed }) => ({
            width: "100%",
            maxWidth: 280,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <BrandGradient
            style={{
              height: 54,
              borderRadius: 27,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontFamily: FONT.semibold, fontSize: 16, color: "#FFFFFF" }}
            >
              Torna alle segnalazioni
            </Text>
          </BrandGradient>
        </Pressable>
      </Animated.View>
    );
  }

  if (step === "cat") {
    return (
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{ flex: 1, backgroundColor: C.bg }}
      >
        <Header
          title="Cosa vuoi segnalare?"
          onBack={resetToList}
          topInset={insets.top}
        />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 18, paddingBottom: insets.bottom + 18 }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {REPORT_CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => {
                  setCategoryId(cat.id);
                  setStep("form");
                }}
                accessibilityRole="button"
                accessibilityLabel={cat.label}
                accessibilityLanguage="it-IT"
                style={({ pressed }) => ({
                  width: "48%",
                  flexGrow: 1,
                  minWidth: 150,
                  gap: 14,
                  alignItems: "flex-start",
                  padding: 18,
                  borderWidth: 1,
                  borderColor: C.stroke,
                  borderRadius: 18,
                  backgroundColor: pressed ? C.sunken : C.card,
                })}
              >
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 13,
                    backgroundColor: C.accSoft,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={cat.icon} size={24} color={C.accInk} />
                </View>
                <Text
                  style={{ fontFamily: FONT.semibold, fontSize: 15, color: C.fg1 }}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    );
  }

  if (step === "form") {
    const cat = findReportCategory(categoryId ?? "altro");
    return (
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{ flex: 1, backgroundColor: C.bg }}
      >
        <Header
          eyebrow={cat.label}
          title="Aggiungi i dettagli"
          onBack={() => setStep("cat")}
          topInset={insets.top}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 18, gap: 14 }}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Descrivi il problema in poche parole…"
              placeholderTextColor={C.fg4}
              multiline
              textAlignVertical="top"
              accessibilityLabel="Descrizione del problema"
              accessibilityLanguage="it-IT"
              style={{
                borderWidth: 1,
                borderColor: C.stroke,
                borderRadius: 16,
                padding: 15,
                fontFamily: FONT.regular,
                fontSize: 16,
                lineHeight: 23,
                color: C.fg1,
                minHeight: 104,
                backgroundColor: C.card,
              }}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Aggiungi una foto"
              accessibilityLanguage="it-IT"
              style={({ pressed }) => ({
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                height: 118,
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: C.stroke,
                borderRadius: 16,
                backgroundColor: pressed ? C.ink100 : C.sunken,
              })}
            >
              <Icon name="camera" size={26} color={C.accInk} />
              <Text
                style={{ fontFamily: FONT.semibold, fontSize: 14, color: C.fg2 }}
              >
                Aggiungi una foto
              </Text>
            </Pressable>
            <View
              accessible
              accessibilityLanguage="it-IT"
              accessibilityLabel={`Posizione attuale: Via Roma 1, ${tenantConfig.name}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 15,
                backgroundColor: C.accSoft,
                borderRadius: 16,
              }}
            >
              <Icon name="map-pin" size={22} color={C.accInk} />
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontFamily: FONT.semibold, fontSize: 14, color: C.fg1 }}
                >
                  Posizione attuale
                </Text>
                <Text
                  style={{
                    fontFamily: FONT.medium,
                    fontSize: 12.5,
                    color: C.fg3,
                    marginTop: 2,
                  }}
                >
                  Via Roma 1, {tenantConfig.name}
                </Text>
              </View>
              <Icon name="check-circle" size={20} color={C.acc} />
            </View>
          </ScrollView>
          <View
            style={{
              paddingTop: 14,
              paddingHorizontal: 18,
              paddingBottom: insets.bottom + 14,
              borderTopWidth: 1,
              borderTopColor: C.hairline,
              backgroundColor: C.card,
            }}
          >
            <Pressable
              onPress={submit}
              accessibilityRole="button"
              accessibilityLabel="Invia al Comune"
              accessibilityLanguage="it-IT"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <BrandGradient
                style={{
                  height: 54,
                  borderRadius: 27,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                }}
              >
                <Icon name="arrow-up" size={20} color="#FFFFFF" />
                <Text
                  style={{
                    fontFamily: FONT.semibold,
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  Invia al Comune
                </Text>
              </BrandGradient>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    );
  }

  // step === "list"
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={{ flex: 1, backgroundColor: C.bg }}
    >
      <Header
        title="Le mie segnalazioni"
        onBack={() => router.back()}
        onMenu={openDrawer}
        topInset={insets.top}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 18,
          paddingBottom: insets.bottom + 110,
        }}
      >
        <Text
          accessibilityLanguage="it-IT"
          style={{
            fontFamily: FONT.regular,
            fontSize: 15,
            lineHeight: 22,
            color: C.fg2,
            marginBottom: 16,
          }}
        >
          Hai notato qualcosa che non va in città? Dillo al Comune in pochi
          secondi — con foto e posizione.
        </Text>
        <View style={{ gap: 10 }}>
          {reports.map((r) => {
            const cat = findReportCategory(r.category);
            const badge = reportBadgeColors(r.state);
            return (
              <View
                key={r.id}
                accessible
                accessibilityLanguage="it-IT"
                accessibilityLabel={`Segnalazione: ${r.text}, ${r.state}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 13,
                  padding: 15,
                  backgroundColor: C.card,
                  borderWidth: 1,
                  borderColor: C.hairline,
                  borderRadius: 18,
                }}
              >
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    backgroundColor: C.accSoft,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={cat.icon} size={20} color={C.accInk} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={{
                      fontFamily: FONT.semibold,
                      fontSize: 15,
                      lineHeight: 19,
                      color: C.fg1,
                    }}
                  >
                    {r.text}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONT.medium,
                      fontSize: 12.5,
                      color: C.fg4,
                      marginTop: 3,
                    }}
                  >
                    {shortItalianTime(r.createdAt)}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: FONT.semibold,
                    fontSize: 11,
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 9,
                    overflow: "hidden",
                    backgroundColor: badge.bg,
                    color: badge.fg,
                  }}
                >
                  {r.state}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          bottom: insets.bottom + 16,
        }}
      >
        <Pressable
          onPress={() => setStep("cat")}
          accessibilityRole="button"
          accessibilityLabel="Nuova segnalazione"
          accessibilityLanguage="it-IT"
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <BrandGradient
            style={{
              height: 54,
              borderRadius: 27,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              shadowColor: "#6C4FD0",
              shadowOpacity: 0.45,
              shadowOffset: { width: 0, height: 12 },
              shadowRadius: 30,
              elevation: 8,
            }}
          >
            <Icon name="plus" size={20} color="#FFFFFF" />
            <Text
              style={{ fontFamily: FONT.semibold, fontSize: 16, color: "#FFFFFF" }}
            >
              Nuova segnalazione
            </Text>
          </BrandGradient>
        </Pressable>
      </View>
    </Animated.View>
  );
}
