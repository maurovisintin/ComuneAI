/**
 * ComuneAI design tokens — "Gemini" palette from the Claude Design handoff.
 * Source: comuneai-app-handoff/project/ComuneAI App.html
 */

export const C = {
  // Neutral "ink" ramp — slightly cool, near-black at top
  ink900: "#0E1726",
  ink800: "#1E2A3B",
  ink700: "#364152",
  ink600: "#4B5666",
  ink500: "#66707F",
  ink400: "#8A93A0",
  ink300: "#B2BAC5",
  ink200: "#D3D9E0",
  ink100: "#E4E8EE",
  ink50: "#F1F4F8",

  // Surfaces
  bg: "#F4F6F9",
  card: "#FFFFFF",
  sunken: "#EDF0F5",
  inverse: "#0E1726",

  // Text (semantic)
  fg1: "#0E1726",
  fg2: "#364152",
  fg3: "#66707F",
  fg4: "#8A93A0",

  // Hairlines & borders
  hairline: "#E7EBF1",
  stroke: "#DBE0E8",
  strokeStrong: "#C5CCD6",

  // Accent — "Gemini" purple
  acc: "#7C5DD6",
  accSoft: "#F3EEFB",
  accInk: "#6C4FD0",

  // Brand gradient stops (135deg blue → purple → red)
  g0: "#4285F4",
  g1: "#9B72CB",
  g2: "#D96570",

  // Status
  ok: "#0F6E40",
  okBg: "#E7F6EE",
  warn: "#8E5400",
  warnBg: "#FBF1DE",
  danger: "#9E2A21",
  dangerBg: "#FBEAE8",
} as const;

/** 135deg brand gradient (blue 0% → purple 52% → red 100%). */
export const GRADIENT = {
  colors: [C.g0, C.g1, C.g2] as const,
  locations: [0, 0.52, 1] as const,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
} as const;

export const FONT = {
  regular: "Nunito_400Regular",
  medium: "Nunito_500Medium",
  semibold: "Nunito_600SemiBold",
  bold: "Nunito_700Bold",
  extrabold: "Nunito_800ExtraBold",
  mono: "DMMono_500Medium",
} as const;

export const CATEGORIES = [
  "Anagrafe",
  "Tributi",
  "Ambiente",
  "Scuola",
  "Cultura",
  "Mobilità",
  "Imprese",
  "Welfare",
  "URP",
  "Generale",
] as const;

export type CategoryKey = (typeof CATEGORIES)[number];
