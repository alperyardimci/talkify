// ============================================
// Talkify - LLM Response Parser
// ============================================

import type { Language } from '@/src/types';
import { getLabels } from './promptTemplates';

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

const PARTICIPANT_DEFAULTS_TR: ParticipantResponseParsed = {
  nickname: 'Gizemli Kişi',
  personality: 'Analiz yapılamadı',
  gossip: 'Dedikodu yok',
  warning: 'Dikkat!',
};

const PARTICIPANT_DEFAULTS_EN: ParticipantResponseParsed = {
  nickname: 'Mystery Person',
  personality: 'Analysis unavailable',
  gossip: 'No gossip',
  warning: 'Watch out!',
};

const GROUP_DEFAULTS_TR: GroupResponseParsed = {
  summary: 'Grup analizi yapılamadı',
  dynamics: 'Dinamik bilgisi yok',
  funFacts: [],
};

const GROUP_DEFAULTS_EN: GroupResponseParsed = {
  summary: 'Group analysis unavailable',
  dynamics: 'No dynamics info',
  funFacts: [],
};

/**
 * Extracts content for a given label from response text.
 */
function extractField(text: string, label: string, nextLabels: string[]): string | null {
  const labelPattern = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${labelPattern}\\s*:?\\s*(.*)`, 'i');
  const match = text.match(regex);

  if (!match) {
    return null;
  }

  let value = match[1].trim();

  const matchIndex = text.indexOf(match[0]);
  const afterMatch = text.substring(matchIndex + match[0].length);

  const lines = afterMatch.split('\n');
  const additionalLines: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0) {
      continue;
    }

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
 * Parses participant analysis response from LLM.
 * Supports both TR labels (LAKAP, KİŞİLİK, DEDİKODU, UYARI)
 * and EN labels (NICKNAME, PERSONALITY, GOSSIP, WARNING).
 */
export function parseParticipantResponse(response: string, language: Language = 'tr'): ParticipantResponseParsed {
  const defaults = language === 'tr' ? PARTICIPANT_DEFAULTS_TR : PARTICIPANT_DEFAULTS_EN;

  if (!response || response.trim().length === 0) {
    return { ...defaults };
  }

  const l = getLabels(language);

  const nickname = extractField(response, l.nickname, [l.personality, l.gossip, l.warning]);
  const personality = extractField(response, l.personality, [l.gossip, l.warning, l.nickname]);
  const gossip = extractField(response, l.gossip, [l.warning, l.nickname, l.personality]);
  const warning = extractField(response, l.warning, [l.nickname, l.personality, l.gossip]);

  return {
    nickname: nickname || defaults.nickname,
    personality: personality || defaults.personality,
    gossip: gossip || defaults.gossip,
    warning: warning || defaults.warning,
  };
}

interface CombinedResponseParsed {
  participants: { name: string; data: ParticipantResponseParsed }[];
  group: GroupResponseParsed;
}

/**
 * Parses a combined response with all participants + group in one block.
 * Expects ---KİŞİ: Name / ---PERSON: Name headers and ---GRUP / ---GROUP header.
 */
export function parseCombinedResponse(response: string, participantNames: string[], language: Language = 'tr'): CombinedResponseParsed {
  const pDefaults = language === 'tr' ? PARTICIPANT_DEFAULTS_TR : PARTICIPANT_DEFAULTS_EN;
  const gDefaults = language === 'tr' ? GROUP_DEFAULTS_TR : GROUP_DEFAULTS_EN;
  const l = getLabels(language);

  const personHeader = language === 'tr' ? 'KİŞİ' : 'PERSON';
  const groupHeader = language === 'tr' ? 'GRUP' : 'GROUP';

  // Split by ---KİŞİ: or ---PERSON: or ---GRUP or ---GROUP
  const sections = response.split(/---\s*/);

  const participants: { name: string; data: ParticipantResponseParsed }[] = [];
  let groupSection = '';

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    // Check if this is a person section
    const personMatch = trimmed.match(new RegExp(`^${personHeader}\\s*:\\s*(.+)`, 'i'));
    if (personMatch) {
      const name = personMatch[1].trim();
      const body = trimmed.substring(personMatch[0].length);
      const nickname = extractField(body, l.nickname, [l.personality, l.gossip, l.warning]);
      const personality = extractField(body, l.personality, [l.gossip, l.warning]);
      const gossip = extractField(body, l.gossip, [l.warning]);
      const warning = extractField(body, l.warning, [l.nickname]);

      participants.push({
        name,
        data: {
          nickname: nickname || pDefaults.nickname,
          personality: personality || pDefaults.personality,
          gossip: gossip || pDefaults.gossip,
          warning: warning || pDefaults.warning,
        },
      });
      continue;
    }

    // Check if this is the group section
    const groupMatch = trimmed.match(new RegExp(`^${groupHeader}`, 'i'));
    if (groupMatch) {
      groupSection = trimmed.substring(groupMatch[0].length);
    }
  }

  // Match parsed names to original participant names (fuzzy)
  const matchedParticipants = participantNames.map((originalName) => {
    const found = participants.find(
      (p) => p.name === originalName || originalName.includes(p.name) || p.name.includes(originalName)
    );
    return {
      name: originalName,
      data: found?.data || { ...pDefaults },
    };
  });

  // Parse group
  const summary = extractField(groupSection, l.summary, [l.dynamics, l.funFacts]);
  const dynamics = extractField(groupSection, l.dynamics, [l.summary, l.funFacts]);
  const funFactsRaw = extractField(groupSection, l.funFacts, [l.summary, l.dynamics]);
  const funFacts = funFactsRaw
    ? funFactsRaw.split('|').map((f) => f.trim()).filter((f) => f.length > 0)
    : gDefaults.funFacts;

  return {
    participants: matchedParticipants,
    group: {
      summary: summary || gDefaults.summary,
      dynamics: dynamics || gDefaults.dynamics,
      funFacts,
    },
  };
}

/**
 * Parses group analysis response from LLM.
 * Supports both TR labels (ÖZET, DİNAMİK, EĞLENCE)
 * and EN labels (SUMMARY, DYNAMICS, FUN_FACTS).
 */
export function parseGroupResponse(response: string, language: Language = 'tr'): GroupResponseParsed {
  const defaults = language === 'tr' ? GROUP_DEFAULTS_TR : GROUP_DEFAULTS_EN;

  if (!response || response.trim().length === 0) {
    return { ...defaults };
  }

  const l = getLabels(language);

  const summary = extractField(response, l.summary, [l.dynamics, l.funFacts]);
  const dynamics = extractField(response, l.dynamics, [l.summary, l.funFacts]);
  const funFactsRaw = extractField(response, l.funFacts, [l.summary, l.dynamics]);

  const funFacts = funFactsRaw
    ? funFactsRaw
        .split('|')
        .map((f) => f.trim())
        .filter((f) => f.length > 0)
    : defaults.funFacts;

  return {
    summary: summary || defaults.summary,
    dynamics: dynamics || defaults.dynamics,
    funFacts,
  };
}
