// ============================================
// Talkify - LLM Response Parser
// ============================================

interface ParticipantResponseParsed {
  nickname: string;
  personality: string;
  gossip: string;
  warning: string;
}

interface GroupResponseParsed {
  summary: string;
  dynamics: string;
  funFacts: string[];
}

const PARTICIPANT_DEFAULTS: ParticipantResponseParsed = {
  nickname: 'Gizemli Kişi',
  personality: 'Analiz yapılamadı',
  gossip: 'Dedikodu yok',
  warning: 'Dikkat!',
};

const GROUP_DEFAULTS: GroupResponseParsed = {
  summary: 'Grup analizi yapılamadı',
  dynamics: 'Dinamik bilgisi yok',
  funFacts: [],
};

/**
 * Belirtilen etiketle başlayan satırın içeriğini çıkarır.
 * Etiketten sonraki tüm metni, bir sonraki bilinen etikete kadar alır.
 */
function extractField(text: string, label: string, nextLabels: string[]): string | null {
  // Etiketin regex patternı: satır başında veya boşluktan sonra, büyük/küçük harf duyarsız
  const labelPattern = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${labelPattern}\\s*:?\\s*(.*)`, 'i');
  const match = text.match(regex);

  if (!match) {
    return null;
  }

  let value = match[1].trim();

  // Eğer sonraki etiketlerden birisi aynı satırda değilse,
  // çok satırlı içerik olabilir - sonraki etikete kadar al
  const matchIndex = text.indexOf(match[0]);
  const afterMatch = text.substring(matchIndex + match[0].length);

  // Sonraki bilinen bir etiket bulana kadar satırları ekle
  const lines = afterMatch.split('\n');
  const additionalLines: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0) {
      continue;
    }

    // Sonraki etiketlerden birine rastlandıysa dur
    const isNextLabel = nextLabels.some((nl) => {
      const nlPattern = new RegExp(`^${nl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:`, 'i');
      return nlPattern.test(trimmedLine);
    });

    if (isNextLabel) {
      break;
    }

    additionalLines.push(trimmedLine);
  }

  if (additionalLines.length > 0) {
    value = value ? `${value} ${additionalLines.join(' ')}` : additionalLines.join(' ');
  }

  return value || null;
}

/**
 * LLM'den gelen katılımcı analiz yanıtını ayrıştırır.
 *
 * Beklenen format:
 *   LAKAP: [yaratıcı lakap]
 *   KİŞİLİK: [2-3 cümle kişilik analizi]
 *   DEDİKODU: [2-3 cümle eğlenceli dedikodu]
 *   UYARI: [1 cümle komik uyarı]
 */
export function parseParticipantResponse(response: string): ParticipantResponseParsed {
  if (!response || response.trim().length === 0) {
    return { ...PARTICIPANT_DEFAULTS };
  }

  const labels = ['LAKAP', 'KİŞİLİK', 'DEDİKODU', 'UYARI'];

  const nickname = extractField(response, 'LAKAP', ['KİŞİLİK', 'DEDİKODU', 'UYARI']);
  const personality = extractField(response, 'KİŞİLİK', ['DEDİKODU', 'UYARI', 'LAKAP']);
  const gossip = extractField(response, 'DEDİKODU', ['UYARI', 'LAKAP', 'KİŞİLİK']);
  const warning = extractField(response, 'UYARI', ['LAKAP', 'KİŞİLİK', 'DEDİKODU']);

  return {
    nickname: nickname || PARTICIPANT_DEFAULTS.nickname,
    personality: personality || PARTICIPANT_DEFAULTS.personality,
    gossip: gossip || PARTICIPANT_DEFAULTS.gossip,
    warning: warning || PARTICIPANT_DEFAULTS.warning,
  };
}

/**
 * LLM'den gelen grup analiz yanıtını ayrıştırır.
 *
 * Beklenen format:
 *   ÖZET: [grup dinamikleri özeti]
 *   DİNAMİK: [ilişki dinamikleri]
 *   EĞLENCE: [eğlenceli bilgi 1] | [eğlenceli bilgi 2] | [eğlenceli bilgi 3]
 */
export function parseGroupResponse(response: string): GroupResponseParsed {
  if (!response || response.trim().length === 0) {
    return { ...GROUP_DEFAULTS };
  }

  const summary = extractField(response, 'ÖZET', ['DİNAMİK', 'EĞLENCE']);
  const dynamics = extractField(response, 'DİNAMİK', ['ÖZET', 'EĞLENCE']);
  const funFactsRaw = extractField(response, 'EĞLENCE', ['ÖZET', 'DİNAMİK']);

  const funFacts = funFactsRaw
    ? funFactsRaw
        .split('|')
        .map((f) => f.trim())
        .filter((f) => f.length > 0)
    : GROUP_DEFAULTS.funFacts;

  return {
    summary: summary || GROUP_DEFAULTS.summary,
    dynamics: dynamics || GROUP_DEFAULTS.dynamics,
    funFacts,
  };
}
