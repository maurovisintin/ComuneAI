export const IconPaths = {
  back: ["M15 6 L9 12 L15 18"],
  search: ["M11 5 A6 6 0 1 1 5 11 A6 6 0 0 1 11 5 Z", "M19 19 L15.5 15.5"],
  menu: ["M4 7 H20", "M4 12 H20", "M4 17 H20"],
  plus: ["M12 5 V19", "M5 12 H19"],
  send: ["M5 12 H19", "M13 6 L19 12 L13 18"],
  mic: [
    "M12 3 A3 3 0 0 0 9 6 V12 A3 3 0 0 0 15 12 V6 A3 3 0 0 0 12 3 Z",
    "M5 11 V12 A7 7 0 0 0 19 12 V11",
    "M12 19 V22",
  ],
  chev: ["M9 6 L15 12 L9 18"],
  chevDn: ["M6 9 L12 15 L18 9"],
  close: ["M6 6 L18 18", "M18 6 L6 18"],
  copy: ["M9 9 H19 V19 H9 Z", "M5 15 H4 V4 H15 V5"],
  thumbUp: [
    "M7 11 V21 H4 V11 Z M7 11 L11 3 A2 2 0 0 1 14 5 V9 H19 A2 2 0 0 1 21 11 L19 19 A2 2 0 0 1 17 21 H7",
  ],
  refresh: [
    "M4 4 V10 H10",
    "M20 20 V14 H14",
    "M5 13 A8 8 0 0 0 19 16",
    "M19 11 A8 8 0 0 0 5 8",
  ],
  location: [
    "M12 22 S5 14 5 10 A7 7 0 0 1 19 10 C19 14 12 22 12 22 Z",
    "M12 12 A2 2 0 1 1 12 8 A2 2 0 0 1 12 12 Z",
  ],
  check: ["M5 12 L10 17 L19 7"],
  doc: ["M8 3 H16 L20 7 V21 H4 V3 Z", "M16 3 V7 H20"],
  archive: ["M3 6 H21 V10 H3 Z M5 10 V20 H19 V10 M10 14 H14"],
  recycle: [
    "M7 11 L4 16 H10 L8 21",
    "M17 13 L20 8 L14 8 L16 3",
    "M9 21 H19 L17 17",
  ],
  card: ["M3 7 H21 V19 H3 Z", "M3 11 H21"],
  school: [
    "M3 10 L12 5 L21 10 L12 15 Z",
    "M7 12 V17 C7 18 9 20 12 20 C15 20 17 18 17 17 V12",
  ],
  car: ["M5 17 H19", "M6 13 H18 L20 17 H4 L6 13 Z", "M8 9 H16 L18 13 H6 Z"],
  bell: [
    "M6 16 V11 A6 6 0 0 1 18 11 V16 L20 18 H4 Z",
    "M10 21 A2 2 0 0 0 14 21",
  ],
  euro: ["M16 8 A6 6 0 1 0 16 16", "M5 10 H13", "M5 14 H13"],
  user: [
    "M12 12 A4 4 0 1 1 12 4 A4 4 0 0 1 12 12 Z",
    "M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21",
  ],
  shield: ["M12 3 L19 6 V12 C19 17 15 20 12 21 C9 20 5 17 5 12 V6 Z"],
  stop: [],
} as const;

export type IconName = keyof typeof IconPaths;
