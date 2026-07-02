import { Image, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { C, FONT } from "@/design/tokens";
import { Icon } from "@/components/icons/icon";

/** "Partner del territorio" sponsored card shown once per conversation. */
export function AdCard({ comuneName }: { comuneName: string }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(280)}
      accessible
      accessibilityLanguage="it-IT"
      accessibilityLabel={`Annuncio di un partner del territorio: Fruttàttiva. Scopri vantaggi e iniziative per i residenti di ${comuneName}.`}
      style={{
        borderWidth: 1,
        borderColor: C.hairline,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: C.card,
        marginBottom: 14,
        shadowColor: "#0E1726",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 9,
          paddingHorizontal: 14,
          backgroundColor: C.sunken,
          borderBottomWidth: 1,
          borderBottomColor: C.hairline,
        }}
      >
        <Text
          style={{
            fontFamily: FONT.bold,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: C.fg3,
          }}
        >
          Partner del territorio
        </Text>
        <Text
          style={{
            fontFamily: FONT.bold,
            fontSize: 9.5,
            letterSpacing: 0.7,
            textTransform: "uppercase",
            color: C.fg4,
            borderWidth: 1,
            borderColor: C.stroke,
            borderRadius: 5,
            paddingVertical: 3,
            paddingHorizontal: 6,
            overflow: "hidden",
          }}
        >
          Adv
        </Text>
      </View>

      <View
        style={{
          paddingTop: 15,
          paddingHorizontal: 16,
          paddingBottom: 17,
          gap: 11,
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            fontFamily: FONT.extrabold,
            fontSize: 23,
            letterSpacing: -0.5,
            color: "#1F7A3D",
          }}
        >
          frutt<Text style={{ color: "#E8A33D" }}>à</Text>ttiva{" "}
          <Text style={{ fontFamily: FONT.semibold, fontSize: 11, color: C.fg3 }}>
            Srl
          </Text>
        </Text>

        <Image
          source={require("../../../assets/images/fruttattiva.png")}
          accessibilityIgnoresInvertColors
          style={{
            alignSelf: "stretch",
            height: 140,
            borderRadius: 12,
            marginVertical: 2,
          }}
          resizeMode="cover"
        />

        <Text
          style={{
            fontFamily: FONT.medium,
            fontSize: 15,
            lineHeight: 22,
            color: C.fg2,
          }}
        >
          Scopri vantaggi e iniziative per i residenti di {comuneName}.
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Approfondisci l'annuncio"
          accessibilityLanguage="it-IT"
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            height: 42,
            paddingHorizontal: 18,
            borderRadius: 21,
            backgroundColor: C.accSoft,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text
            style={{ fontFamily: FONT.semibold, fontSize: 15, color: C.accInk }}
          >
            Approfondisci
          </Text>
          <Icon name="arrow-right" size={18} color={C.accInk} />
        </Pressable>
      </View>
    </Animated.View>
  );
}
