import { fetch as expoFetch } from "expo/fetch";
import { mockStream } from "./mock-stream";

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

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function* streamChat(
  args: StreamChatArgs
): AsyncGenerator<string> {
  if (!API_URL) {
    if (!__DEV__) {
      throw new Error(
        "EXPO_PUBLIC_API_URL is not configured. Set it in your environment."
      );
    }
    yield* mockStream(args.signal);
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
        yield decoder.decode(value, { stream: true });
      }
    }
  } finally {
    reader.releaseLock();
  }
}
