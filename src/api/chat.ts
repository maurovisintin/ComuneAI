import { fetch as expoFetch } from "expo/fetch";
import type { MessageMeta } from "@/db/queries";
import { mockAnswerFor } from "./mock-answers";

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type StreamChatArgs = {
  tenantSlug: string;
  systemPrompt: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
};

export type StreamEvent =
  | { type: "text"; chunk: string }
  | { type: "meta"; meta: MessageMeta };

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function* mockStream(
  args: StreamChatArgs
): AsyncGenerator<StreamEvent> {
  const lastUser = [...args.messages]
    .reverse()
    .find((m) => m.role === "user");
  const answer = mockAnswerFor(lastUser?.content ?? "");

  // Simulated "sta scrivendo…" pause before the reply streams in.
  await new Promise((r) => setTimeout(r, 1100));
  if (args.signal?.aborted) return;

  const tokens = answer.text.split(/(\s+)/);
  for (const token of tokens) {
    if (args.signal?.aborted) return;
    await new Promise((r) => setTimeout(r, 30));
    yield { type: "text", chunk: token };
  }
  yield { type: "meta", meta: answer.meta };
}

export async function* streamChat(
  args: StreamChatArgs
): AsyncGenerator<StreamEvent> {
  if (!API_URL) {
    if (!__DEV__) {
      throw new Error(
        "EXPO_PUBLIC_API_URL is not configured. Set it in your environment."
      );
    }
    yield* mockStream(args);
    return;
  }

  const response = await expoFetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tenantSlug: args.tenantSlug,
      systemPrompt: args.systemPrompt,
      messages: args.messages,
    }),
    signal: args.signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Chat request failed (${response.status}): ${text}`);
  }

  if (!response.body) {
    throw new Error("Chat response has no body to stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) return;
      if (value) {
        yield { type: "text", chunk: decoder.decode(value, { stream: true }) };
      }
    }
  } finally {
    reader.releaseLock();
  }
}
