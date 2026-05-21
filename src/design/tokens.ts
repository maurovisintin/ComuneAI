export const C = {
  blue: "#0B3D91",
  blueDark: "#06255C",
  blueDarker: "#041838",
  blueLight: "#1E62C9",
  gold: "#D69E2E",
  goldSoft: "#FCE9C1",
  ink: "#0E1B33",
  text: "#1F2A44",
  textMuted: "#5A6680",
  textFaint: "#8A93A6",
  border: "#D6DBE5",
  borderSoft: "#E6E9F0",
  bg: "#FFFFFF",
  bgSoft: "#F4F6FA",
  bgSofter: "#FAFBFD",
  userBubble: "#EEF2FA",
  green: "#1A8754",
  greenSoft: "#E8F0E8",
  greenInk: "#1A6B3D",
  red: "#B14B25",
  locationBg: "#F0F5FF",
  bolloBg: "#FFF8E6",
  bolloInk: "#8A6A18",
} as const;

export const FONT_FAMILY = "TitilliumWeb_400Regular";
export const FONT_FAMILY_MEDIUM = "TitilliumWeb_600SemiBold";
export const FONT_FAMILY_BOLD = "TitilliumWeb_700Bold";

export const CATEGORIES = {
  Anagrafe: { accent: C.blue, iconName: "doc" as const },
  Tributi: { accent: C.red, iconName: "euro" as const },
  Ambiente: { accent: C.green, iconName: "recycle" as const },
  Scuola: { accent: C.green, iconName: "school" as const },
  Mobilità: { accent: C.blueLight, iconName: "car" as const },
  Welfare: { accent: C.gold, iconName: "archive" as const },
  URP: { accent: C.blue, iconName: "doc" as const },
  Generale: { accent: C.blue, iconName: "doc" as const },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
