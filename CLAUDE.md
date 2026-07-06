# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ComuneAI (`it.comunichat.app`) — an Expo SDK 54 / React Native app: a voice-first, chat-based citizen assistant for Italian municipalities (comuni of Puglia). All UI copy is in Italian.

## Commands

```bash
npx expo start          # dev server (Metro)
npm run ios             # build & run on iOS (native ios/ project is checked in)
npm run android
npm run web
npx tsc --noEmit        # type check — there is no lint or test setup
```

- **Use npm, never pnpm or `expo install`** — `expo install` resolves to pnpm on this machine and corrupts the npm lockfile. Add deps with `npm install <pkg>@<version compatible with SDK 54>`.
- iOS builds (`xcodebuild`) fail under sandboxed shells — run them unsandboxed. If a build hangs, check for orphaned `xcodebuild` processes holding locks.

## Critical dependency pin

`react-native-css` is pinned to `0.0.0-nightly.5ce6396` and `.npmrc` sets `legacy-peer-deps=true` (see the comment in `.npmrc`). **Do not upgrade react-native-css to 3.x** until nativewind/react-native-css#293 is fixed — 3.x breaks Tailwind CSS compilation on native. NativeWind is on the v5 preview with Tailwind v4.

## Architecture

**Routing (expo-router, file-based in `app/`):** `index` → `welcome` → `select-tenant` → `app/[tenant]/` (the whole app lives under a tenant slug). Inside a tenant: `index` (chat home), `c/[id]` (conversation), `segnalazioni` (issue reports).

**Multi-tenancy:** `src/tenants/config.ts` holds a static list of comuni; each `Tenant` has a slug (used as the route param) and a per-comune Italian system prompt. The chosen tenant persists via `src/tenants/storage.ts` (AsyncStorage). Unknown slugs redirect to `/select-tenant`.

**Tenant UI shell:** `app/[tenant]/_layout.tsx` owns the drawer, full-screen voice overlay, and story viewer, exposed to screens through `TenantUIContext` (`src/context/tenant-ui.tsx`) — e.g. `openVoice(onResult)` hands back the final speech transcript.

**Chat streaming:** `src/api/chat.ts` exposes an async-generator stream of `StreamEvent`s (`text` chunks + `meta`). With `EXPO_PUBLIC_API_URL` unset it falls back to a mock stream fed by `src/api/mock-answers.ts` (this is the current default — there is no real backend yet). Real requests use `expo/fetch` for streaming.

**Persistence:** `expo-sqlite` opened synchronously in `src/db/index.ts`, with manual versioned migrations driven by `PRAGMA user_version` and SQL blocks in `src/db/schema.ts` (bump `SCHEMA_VERSION` and add a block for schema changes). All reads/writes go through `src/db/queries.ts`; React Query wraps them at the screen level. Tables: `conversations`, `messages`, `reports` — all scoped by `tenant_slug`.

**Styling:** Tailwind classes on RN primitives via the wrappers in `src/tw/index.tsx` (`View`, `Text`, `Pressable`, `Link`, …) — import those, not bare `react-native` components, when you need `className`. Design tokens live in two places that must stay in sync: CSS variables in `src/global.css` (`@theme`) and the `C` object in `src/design/tokens.ts` for places needing raw values. The visual reference is the Claude Design handoff bundle in `design-handoff/` (gitignored) — the "Gemini" palette.

**Startup:** `app/_layout.tsx` blocks rendering until the SQLite DB is initialized and the Nunito/DM Mono fonts load.

**Speech:** `expo-speech-recognition` via `src/hooks/use-speech-recognition.ts`; permission strings are configured in `app.json` (Italian).
