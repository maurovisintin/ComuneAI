import type { MessageMeta } from "@/db/queries";

export type MockAnswer = {
  text: string;
  meta: MessageMeta;
};

/**
 * Canned demo answers from the design handoff — used while the real
 * backend (EXPO_PUBLIC_API_URL) is not configured.
 */
export function mockAnswerFor(question: string): MockAnswer {
  const s = question.toLowerCase();

  if (s.includes("imu") || s.includes("tass")) {
    return {
      text: "Ciao! La seconda rata IMU 2025 si paga entro il 16 dicembre. Puoi pagarla con pagoPA direttamente da qui.",
      meta: {
        highlight: {
          title: "Scadenza e importo",
          lines: [
            "Saldo entro il 16/12/2025",
            "Pagamento con pagoPA, anche dall'app",
            "Abitazione principale: esente",
          ],
        },
        sources: [
          { label: "Delibera C.C. n.47/2023", meta: "art. 8" },
          { label: "Portale pagoPA", ext: true },
        ],
        verified: true,
      },
    };
  }

  if (s.includes("differenz") || s.includes("rifiut")) {
    return {
      text: "Dipende dalla tua via. Per il centro la raccolta segue questo calendario settimanale.",
      meta: {
        highlight: {
          title: "Calendario · via Roma",
          lines: [
            "Umido: lun, mer, ven",
            "Plastica e lattine: martedì",
            "Carta e cartone: giovedì",
            "Indifferenziato: sabato",
          ],
        },
        sources: [{ label: "Calendario raccolta 2025 (PDF)" }],
        verified: true,
      },
    };
  }

  if (s.includes("bibliotec")) {
    return {
      text: 'Volentieri! La Biblioteca Comunale "E. de Bellis" è in via Roma 1, nel centro storico.',
      meta: {
        highlight: {
          title: "Orari di apertura",
          lines: [
            "Lun–Ven: 9:00–13:00 / 15:00–19:00",
            "Sabato: 9:00–13:00",
            "Domenica: chiusa",
          ],
        },
        sources: [{ label: "Pagina Biblioteca", ext: true }],
        verified: true,
      },
    };
  }

  if (s.includes("carta") || s.includes("identit")) {
    return {
      text: "Sì, puoi richiederla allo sportello Anagrafe su appuntamento, oppure avviare la pratica online.",
      meta: {
        highlight: {
          title: "Cosa serve",
          lines: [
            "SPID o CIE per prenotare",
            "Una foto tessera recente",
            "€16,79 + €5,42 di diritti",
          ],
        },
        sources: [
          { label: "Anagrafe Nazionale (ANPR)", ext: true },
          { label: "Prenota appuntamento" },
        ],
        verified: true,
      },
    };
  }

  if (
    s.includes("nido") ||
    s.includes("asilo") ||
    s.includes("mensa") ||
    s.includes("scol")
  ) {
    return {
      text: "Ciao! L'asilo nido comunale è aperto dal lunedì al venerdì. Ecco gli orari principali.",
      meta: {
        highlight: {
          title: "Orari",
          lines: [
            "Ingresso: 7:30 – 9:00",
            "Uscita: 15:30 – 16:30",
            "Tempo prolungato fino alle 18:00",
          ],
        },
        sources: [
          { label: "Regolamento asili nido", meta: "art. 8" },
          { label: "Modulo iscrizione (PDF)" },
        ],
        verified: true,
      },
    };
  }

  return {
    text: "Certo, te lo spiego in modo semplice. Puoi fare tutto online, senza andare allo sportello: ti guido passo passo.",
    meta: {
      sources: [{ label: "Regolamento comunale", meta: "art. 12" }],
      verified: true,
    },
  };
}
