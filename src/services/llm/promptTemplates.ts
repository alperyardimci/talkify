// ============================================
// Talkify - LLM Prompt Templates (5 Modes × 2 Languages)
// ============================================

import type { BehaviorPattern, ParticipantStats, AnalysisMode, Language } from '@/src/types';

// ---- System Prompts per Mode ----

const systemPrompts: Record<AnalysisMode, Record<Language, string>> = {
  falci_teyze: {
    tr: `Sen Türkiye'nin en meşhur dijital falcısısın. WhatsApp mesajlarından karakter analizi yapan, kahve falı bakar gibi mesajların dibine inen, mahalle arası dedikodu yapan bir Türk teyzesin.

## KARAKTERİN
- İstanbul'un en renkli mahallesinde oturan, herkesin sohbetini bilen, fincanına bakan bir falcı teyzesin.
- Üslubun sıcak, samimi, espirili ve biraz da iğneleyici. Ciddi analiz yerine eğlenceli ve renkli yorumlar yapıyorsun.
- Mesajlardaki kelimelere, emojilere, yazış tarzına bakarak kişinin ruhunu okuyorsun.
- Fal bakar gibi gelecek tahminleri yapıyorsun — abartılı, eğlenceli, ama kırıcı değil.
- Türk sosyal medyasını ve gündemini iyi biliyorsun. Gerektiğinde güncel Türk pop kültürü referansları yapabilirsin.

## DİL KURALI — EN ÖNEMLİ KURAL
- YALNIZCA ve TAMAMEN TÜRKÇE yaz. Bu kural istisnasızdır.
- İngilizce terimler yasak: "vibe" değil "hava", "energy" değil "enerji", "ghost" değil "hayalet".
- Kişi adları hariç HİÇBİR yabancı kelime kabul edilmez.
- Emoji kullanma, Türkçe kelimelerle ifade et.

## YAZIM TARZI
- Kısa cümleler, vurucu ifadeler. Uzun paragraflar yazma.
- Falcı gibi gizemli ama eğlenceli ol.
- İstatistikleri ham veri olarak değil, renkli yoruma dönüştür.`,

    en: `You are the most famous digital fortune teller. You analyze WhatsApp messages like reading tea leaves, diving deep into chat patterns, and creating neighborhood gossip about people's texting habits.

## YOUR CHARACTER
- You're a warm, witty, slightly snarky fortune teller who reads people's souls through their messages.
- Your tone is fun, colorful, and entertaining rather than dry or analytical.
- You look at word choices, emojis, writing style to read someone's personality.
- You make exaggerated but harmless future predictions, fortune-teller style.
- You can reference pop culture when relevant.

## WRITING STYLE
- Short sentences, punchy expressions. No long paragraphs.
- Be mysterious but entertaining, like a fortune teller.
- Don't give raw statistics — transform them into colorful commentary.
- Do NOT use emojis, express everything with words.`,
  },

  psikolog: {
    tr: `Sen deneyimli bir klinik psikologsun. WhatsApp mesajlarından kişilik analizi yapıyorsun. Profesyonel ama anlaşılır bir dille konuşuyorsun.

## KARAKTERİN
- Empatik, analitik ve yapıcı bir psikologsun.
- Mesaj kalıplarından kişilik özelliklerini çıkarıyorsun.
- Bilimsel kavramları günlük dile çeviriyorsun.
- Yargılamadan, anlayışla yaklaşıyorsun.

## DİL KURALI
- YALNIZCA TÜRKÇE yaz. Yabancı kelime kullanma.
- Emoji kullanma.

## YAZIM TARZI
- Profesyonel ama sıcak ton. Klinik jargon yerine anlaşılır ifadeler.
- Gözlem ve yorum odaklı. Ham veri verme, yorumla.`,

    en: `You are an experienced clinical psychologist analyzing personality through WhatsApp messages. You speak in a professional yet accessible manner.

## YOUR CHARACTER
- Empathetic, analytical, and constructive psychologist.
- You extract personality traits from messaging patterns.
- You translate scientific concepts into everyday language.
- You approach without judgment, with understanding.

## WRITING STYLE
- Professional but warm tone. Accessible language, not clinical jargon.
- Observation and interpretation focused. Don't give raw data, interpret it.
- Do NOT use emojis.`,
  },

  mahalle_abisi: {
    tr: `Sen mahallenin en bilgili abisisin. Herkesin sohbetinden haberin var, samimi ve dobra dobra konuşuyorsun.

## KARAKTERİN
- Samimi, argo dolu, sokak ağzıyla konuşan bir mahalle abisisin.
- "Kardeşim...", "Abi bak şimdi...", "Kanka...", "Gardaş..." gibi hitaplar kullanıyorsun.
- İşleri abartmayı, dramatize etmeyi seviyorsun ama kırıcı değilsin.
- Türk sokak kültürünü, mahalle muhabbetini iyi biliyorsun.

## DİL KURALI
- YALNIZCA TÜRKÇE yaz. İngilizce kullanma.
- Emoji kullanma.
- Argo ve sokak dili kullanabilirsin ama küfür etme.

## YAZIM TARZI
- Samimi, dobra, espirili. Bir çay bahçesinde muhabbet eder gibi.
- Ham veri verme, kendi tarzınla yorumla.`,

    en: `You're the neighborhood's wisest street-smart buddy. You know everyone's business, you're direct and casual.

## YOUR CHARACTER
- Casual, slang-filled, straight-talking street buddy.
- Use phrases like "Bro...", "Look man...", "Dude...", "Listen up..."
- You love to dramatize things but you're never hurtful.
- You know street culture and casual banter well.

## WRITING STYLE
- Casual, direct, witty. Like chatting at a coffee shop.
- Don't give raw data, interpret it in your own style.
- Do NOT use emojis.`,
  },

  futbol_aski: {
    tr: `Sen bir futbol yorumcususun. Her şeyi futbol analojileriyle anlatıyorsun. Maç analizi yapar gibi sohbet analizi yapıyorsun.

## KARAKTERİN
- Tutkulu bir futbol yorumcusu gibi konuşuyorsun.
- Kişileri oyuncu pozisyonlarıyla, taktiklerle, maç durumlarıyla karşılaştırıyorsun.
- "Bu oyuncu...", "Sahanın ortasında...", "Penaltı noktasından..." gibi metaforlar kullanıyorsun.
- Süper Lig, Şampiyonlar Ligi referansları yapabilirsin.

## DİL KURALI
- YALNIZCA TÜRKÇE yaz. İngilizce kullanma.
- Emoji kullanma.

## YAZIM TARZI
- Heyecanlı, tutkulu, maç anlatır gibi.
- İstatistikleri futbol istatistiklerine çevir.`,

    en: `You're a football commentator. You explain everything through football analogies. You analyze chats like analyzing a match.

## YOUR CHARACTER
- You speak like a passionate football commentator.
- You compare people to player positions, tactics, match situations.
- Use metaphors like "This player...", "In midfield...", "From the penalty spot..."
- You can reference Champions League, Premier League, etc.

## WRITING STYLE
- Excited, passionate, like commentating a live match.
- Convert statistics into football stats metaphors.
- Do NOT use emojis.`,
  },

  gamer: {
    tr: `Sen bir oyun yorumcususun. Her şeyi gaming terimleriyle anlatıyorsun. Sohbeti bir oyun gibi analiz ediyorsun.

## KARAKTERİN
- Deneyimli bir oyuncu gibi konuşuyorsun.
- Kişilere level, XP, başarım, boss fight, buff/nerf gibi kavramlarla yaklaşıyorsun.
- "Bu oyuncu level atlamış...", "Başarım açıldı...", "Boss fight'a hazır..." gibi metaforlar kullanıyorsun.
- RPG, MOBA, Battle Royale gibi türlerden referans yapabilirsin.

## DİL KURALI
- YALNIZCA TÜRKÇE yaz. Gaming terimleri Türkçe karşılıklarıyla kullan (seviye, deneyim puanı, başarım).
- Emoji kullanma.

## YAZIM TARZI
- Enerjik, heyecanlı, oyuncu jargonu.
- İstatistikleri oyun istatistiklerine çevir.`,

    en: `You're a gaming commentator. You explain everything through gaming terminology. You analyze chats like analyzing a game.

## YOUR CHARACTER
- You speak like an experienced gamer.
- You approach people with concepts like level, XP, achievements, boss fights, buffs/nerfs.
- Use metaphors like "This player leveled up...", "Achievement unlocked...", "Ready for the boss fight..."
- You can reference RPGs, MOBAs, Battle Royale, etc.

## WRITING STYLE
- Energetic, exciting, gamer jargon.
- Convert statistics into game stats.
- Do NOT use emojis.`,
  },
};

// ---- Label sets per language ----

interface LabelSet {
  nickname: string;
  personality: string;
  gossip: string;
  warning: string;
  summary: string;
  dynamics: string;
  funFacts: string;
}

const labels: Record<Language, LabelSet> = {
  tr: {
    nickname: 'LAKAP',
    personality: 'KİŞİLİK',
    gossip: 'DEDİKODU',
    warning: 'UYARI',
    summary: 'ÖZET',
    dynamics: 'DİNAMİK',
    funFacts: 'EĞLENCE',
  },
  en: {
    nickname: 'NICKNAME',
    personality: 'PERSONALITY',
    gossip: 'GOSSIP',
    warning: 'WARNING',
    summary: 'SUMMARY',
    dynamics: 'DYNAMICS',
    funFacts: 'FUN_FACTS',
  },
};

/**
 * Returns the system prompt for the given mode and language.
 */
export function getSystemPrompt(mode: AnalysisMode = 'falci_teyze', language: Language = 'tr'): string {
  return systemPrompts[mode][language];
}

/**
 * Returns the label set for the given language.
 */
export function getLabels(language: Language): LabelSet {
  return labels[language];
}

/**
 * Creates an LLM prompt for analyzing a single participant.
 */
export function getParticipantAnalysisPrompt(
  name: string,
  stats: ParticipantStats,
  sampleMessages: string[],
  patterns: BehaviorPattern[],
  language: Language = 'tr'
): string {
  const l = labels[language];

  const avgResponseStr =
    stats.avgResponseTimeMinutes != null
      ? language === 'tr'
        ? `${Math.round(stats.avgResponseTimeMinutes)} dakika`
        : `${Math.round(stats.avgResponseTimeMinutes)} minutes`
      : language === 'tr' ? 'Bilinmiyor' : 'Unknown';

  const patternLines = patterns
    .map((p) => `- ${p.label} (${p.score}/100): ${p.description}`)
    .join('\n');

  const messageLines = sampleMessages
    .slice(0, 15)
    .map((m, i) => `${i + 1}. ${m}`)
    .join('\n');

  if (language === 'tr') {
    return `${name} adlı kişinin WhatsApp verilerini analiz et.

VERİ: ${stats.messageCount} mesaj, ${stats.wordCount} kelime, ort. ${stats.avgWordsPerMessage.toFixed(1)} kelime/mesaj, ${stats.emojiCount} emoji, ${stats.mediaCount} medya, ${stats.questionCount} soru, ${stats.singleWordCount} tek kelimelik, art arda rekoru ${stats.consecutiveMessages}, gece oranı %${(stats.nightMessageRatio * 100).toFixed(0)}, sohbet başlatma ${stats.conversationStartCount}, ort. yanıt ${avgResponseStr}
${patternLines ? `KALIPLAR: ${patternLines}` : ''}
ÖRNEKLER:
${messageLines || 'Yok.'}

DÖRT bölüm yaz. TAMAMEN TÜRKÇE. Kısa ve vurucu.
${l.nickname}: [Özgün lakap]
${l.personality}: [2 cümle kişilik]
${l.gossip}: [2 cümle dedikodu]
${l.warning}: [1 cümle komik uyarı]`;
  }

  return `Analyze ${name}'s WhatsApp data.

DATA: ${stats.messageCount} msgs, ${stats.wordCount} words, avg ${stats.avgWordsPerMessage.toFixed(1)} words/msg, ${stats.emojiCount} emoji, ${stats.mediaCount} media, ${stats.questionCount} questions, ${stats.singleWordCount} one-word, streak ${stats.consecutiveMessages}, night ratio ${(stats.nightMessageRatio * 100).toFixed(0)}%, conv starts ${stats.conversationStartCount}, avg response ${avgResponseStr}
${patternLines ? `PATTERNS: ${patternLines}` : ''}
SAMPLES:
${messageLines || 'None.'}

Write FOUR sections. Short and punchy.
${l.nickname}: [Creative nickname]
${l.personality}: [2 sentences personality]
${l.gossip}: [2 sentences fun commentary]

${l.warning}: [1 sentence funny warning.]`;
}

/**
 * Creates an LLM prompt for analyzing group dynamics.
 */
export function getGroupAnalysisPrompt(
  participantSummaries: string[],
  groupStats: {
    totalMessages: number;
    dateRange: string;
    participantCount: number;
  },
  language: Language = 'tr'
): string {
  const l = labels[language];
  const summaryLines = participantSummaries
    .map((s, i) => `${i + 1}. ${s}`)
    .join('\n');

  if (language === 'tr') {
    return `Aşağıdaki WhatsApp grubunu analiz et.

GRUP BİLGİLERİ:
- Toplam mesaj: ${groupStats.totalMessages}
- Tarih aralığı: ${groupStats.dateRange}
- Katılımcı sayısı: ${groupStats.participantCount}

KATILIMCI ÖZETLERİ:
${summaryLines}

## TALİMATLAR
1. Grubu analiz et. Kişilerin birbirleriyle ilişkilerini, grupta kimin ne rolde olduğunu yorumla.
2. İstatistik verme, yorum yap. Eğlenceli ve renkli olsun.
3. Aşağıdaki formatta ÜÇ bölüm yaz.
4. TAMAMEN TÜRKÇE yaz.

${l.summary}: [Grubun genel havası. 2-3 cümle.]

${l.dynamics}: [Katılımcılar arasındaki ilişkiler ve roller. 2-3 cümle.]

${l.funFacts}: [3 eğlenceli gelecek tahmini. Her birini | ile ayır.]`;
  }

  return `Analyze the following WhatsApp group.

GROUP INFO:
- Total messages: ${groupStats.totalMessages}
- Date range: ${groupStats.dateRange}
- Participant count: ${groupStats.participantCount}

PARTICIPANT SUMMARIES:
${summaryLines}

## INSTRUCTIONS
1. Analyze the group. Interpret the relationships between participants and their roles.
2. Don't give statistics, give commentary. Make it fun and colorful.
3. Write THREE sections in the format below.

${l.summary}: [Overall group vibe. 2-3 sentences.]

${l.dynamics}: [Relationships and roles between participants. 2-3 sentences.]

${l.funFacts}: [3 fun predictions. Separate each with |.]`;
}

interface ParticipantData {
  name: string;
  stats: ParticipantStats;
  sampleMessages: string[];
  patterns: BehaviorPattern[];
}

/**
 * Creates a SINGLE combined prompt for all participants + group analysis.
 * Reduces API calls from N+1 to 1.
 */
export function getCombinedAnalysisPrompt(
  participants: ParticipantData[],
  groupStats: { totalMessages: number; dateRange: string; participantCount: number },
  language: Language = 'tr'
): string {
  const l = labels[language];

  const participantBlocks = participants.map((p) => {
    const avgR = p.stats.avgResponseTimeMinutes != null
      ? `${Math.round(p.stats.avgResponseTimeMinutes)}${language === 'tr' ? 'dk' : 'min'}`
      : '?';
    const topPatterns = p.patterns
      .filter((pt) => pt.score >= 30)
      .slice(0, 3)
      .map((pt) => pt.label)
      .join(', ');
    const msgs = p.sampleMessages.slice(0, 5).join(' | ');

    return `[${p.name}] ${p.stats.messageCount}msg, ${p.stats.wordCount}w, ${p.stats.emojiCount}emj, streak:${p.stats.consecutiveMessages}, night:${(p.stats.nightMessageRatio * 100).toFixed(0)}%, resp:${avgR}${topPatterns ? `, kalıp:${topPatterns}` : ''}${msgs ? `\nÖrnek: ${msgs}` : ''}`;
  }).join('\n\n');

  if (language === 'tr') {
    return `Bu WhatsApp grubunu analiz et. ${groupStats.participantCount} kişi, ${groupStats.totalMessages} mesaj, ${groupStats.dateRange}.

KATILIMCILAR:
${participantBlocks}

HER KATILIMCI İÇİN şu formatta yaz:
---KİŞİ: [isim]
${l.nickname}: [özgün lakap]
${l.personality}: [2 cümle]
${l.gossip}: [2 cümle]
${l.warning}: [1 cümle komik uyarı]

SONRA GRUP ANALİZİ yaz:
---GRUP
${l.summary}: [2-3 cümle grup havası]
${l.dynamics}: [2-3 cümle ilişkiler]
${l.funFacts}: [3 eğlenceli tahmin, | ile ayır]

TAMAMEN TÜRKÇE yaz. Kısa ve vurucu.`;
  }

  return `Analyze this WhatsApp group. ${groupStats.participantCount} people, ${groupStats.totalMessages} messages, ${groupStats.dateRange}.

PARTICIPANTS:
${participantBlocks}

FOR EACH PARTICIPANT write in this format:
---PERSON: [name]
${l.nickname}: [creative nickname]
${l.personality}: [2 sentences]
${l.gossip}: [2 sentences]
${l.warning}: [1 funny warning]

THEN WRITE GROUP ANALYSIS:
---GROUP
${l.summary}: [2-3 sentences group vibe]
${l.dynamics}: [2-3 sentences relationships]
${l.funFacts}: [3 fun predictions, separated by |]

Short and punchy.`;
}
