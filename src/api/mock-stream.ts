const FALLBACK_REPLY =
  "Ciao! Sono l'assistente virtuale del Comune. " +
  "Al momento il backend non è configurato (EXPO_PUBLIC_API_URL non impostato), " +
  "quindi questa è una risposta simulata. Posso aiutarti a costruire l'interfaccia " +
  "mentre il servizio AI viene preparato.";

export async function* mockStream(
  signal?: AbortSignal
): AsyncGenerator<string> {
  const tokens = FALLBACK_REPLY.split(/(\s+)/);
  for (const token of tokens) {
    if (signal?.aborted) return;
    await new Promise((r) => setTimeout(r, 35));
    yield token;
  }
}
