import { View, Text } from "react-native";
import {
  C,
  FONT_FAMILY,
  FONT_FAMILY_BOLD,
  FONT_FAMILY_MEDIUM,
} from "@/design/tokens";
import { Crest } from "@/components/icons/crest";
import { SuggestionCard } from "@/components/suggestion-card";
import { suggestions, type Suggestion } from "@/suggestions/config";
import type { Tenant } from "@/tenants/config";

type Props = {
  tenant: Tenant;
  onSuggestionPress: (s: Suggestion) => void;
};

export function EmptyChat({ tenant, onSuggestionPress }: Props) {
  return (
    <View>
      <View style={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 8 }}>
        <Crest size={48} />
        <Text
          accessibilityLanguage="it-IT"
          style={{
            fontSize: 11,
            color: C.blue,
            letterSpacing: 0.9,
            fontFamily: FONT_FAMILY_BOLD,
            marginTop: 16,
          }}
        >
          {`COMUNE DI ${tenant.name.toUpperCase()} · ${tenant.province}`}
        </Text>
        <Text
          accessibilityRole="header"
          accessibilityLanguage="it-IT"
          style={{
            fontSize: 24,
            color: C.ink,
            marginTop: 6,
            marginBottom: 10,
            lineHeight: 28,
            fontFamily: FONT_FAMILY_BOLD,
            letterSpacing: -0.4,
          }}
        >
          Buongiorno, come posso aiutarla?
        </Text>
        <Text
          accessibilityLanguage="it-IT"
          style={{
            fontSize: 14,
            color: C.textMuted,
            lineHeight: 22,
            fontFamily: FONT_FAMILY,
          }}
        >
          Faccia una domanda sui servizi, le scadenze o i regolamenti del Comune.
          Posso indicarle il modulo, lo sportello o la fonte ufficiale.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
        <Text
          accessibilityRole="header"
          accessibilityLanguage="it-IT"
          style={{
            fontSize: 11,
            color: C.textMuted,
            fontFamily: FONT_FAMILY_BOLD,
            letterSpacing: 0.8,
            marginBottom: 10,
            paddingLeft: 4,
          }}
        >
          DOMANDE FREQUENTI
        </Text>
        <View style={{ gap: 8 }}>
          {suggestions.map((s) => (
            <SuggestionCard key={s.q} suggestion={s} onPress={onSuggestionPress} />
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16 }}>
        <View
          style={{
            backgroundColor: C.bgSofter,
            borderWidth: 1,
            borderColor: C.borderSoft,
            borderRadius: 4,
            paddingVertical: 14,
            paddingHorizontal: 16,
          }}
        >
          <Text
            accessibilityRole="header"
            accessibilityLanguage="it-IT"
            style={{
              fontSize: 12,
              color: C.text,
              fontFamily: FONT_FAMILY_BOLD,
              marginBottom: 8,
            }}
          >
            Cosa posso fare
          </Text>
          {[
            "Spiegare procedure e tempistiche",
            "Indicare moduli e sportelli competenti",
            "Citare il regolamento o la delibera di riferimento",
          ].map((t) => (
            <Text
              key={t}
              accessibilityLanguage="it-IT"
              style={{
                fontSize: 13,
                color: C.textMuted,
                lineHeight: 21,
                fontFamily: FONT_FAMILY,
                paddingLeft: 12,
              }}
            >
              • {t}
            </Text>
          ))}
          <View style={{ height: 1, backgroundColor: C.borderSoft, marginVertical: 12 }} />
          <Text
            accessibilityRole="header"
            accessibilityLanguage="it-IT"
            style={{
              fontSize: 12,
              color: C.text,
              fontFamily: FONT_FAMILY_BOLD,
              marginBottom: 8,
            }}
          >
            Cosa non posso fare
          </Text>
          {[
            "Rilasciare certificati o atti ufficiali",
            "Accedere ai dati della sua posizione anagrafica",
            "Sostituire il parere di un funzionario",
          ].map((t) => (
            <Text
              key={t}
              accessibilityLanguage="it-IT"
              style={{
                fontSize: 13,
                color: C.textMuted,
                lineHeight: 21,
                fontFamily: FONT_FAMILY,
                paddingLeft: 12,
              }}
            >
              • {t}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
