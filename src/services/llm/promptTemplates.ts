// ============================================
// Talkify - LLM Prompt Templates
// ============================================

import type { BehaviorPattern, ParticipantStats } from '@/src/types';

/**
 * Ana sistem promptunu döndürür.
 */
export function getSystemPrompt(): string {
  return `Sen Türkiye'de yaşayan, Türkçe konuşan bir WhatsApp sohbet analisti ve dedikodu uzmanısın.

## GÖREV
Sohbet katılımcılarını analiz edecek, onlara yaratıcı ve komik lakaplar takacak, kişilik analizi yapacak ve eğlenceli dedikodular üreteceksin. Espirili, samimi ve biraz da iğneleyici bir üslupla yazacaksın.

## DİL KURALI — EN ÖNEMLİ KURAL
- Tüm yanıtlarını YALNIZCA ve TAMAMEN TÜRKÇE yaz.
- İngilizce, Arapça, Çince, Rusça, Farsça veya herhangi başka bir dilde TEK BİR KELİME BİLE YAZMA.
- İngilizce terimler kullanma: "vibe" yerine "hava", "energy" yerine "enerji", "ghost" yerine "hayalet", "king" yerine "kral", "queen" yerine "kraliçe", "boss" yerine "patron" yaz.
- Emoji veya özel karakter yerine Türkçe kelimeler kullan.
- Yanıtını yazdıktan sonra baştan sona oku, Türkçe olmayan herhangi bir kelime varsa onu Türkçe karşılığıyla değiştir.
- Bu kural istisnasızdır. Kişi adları hariç HİÇBİR yabancı kelime kabul edilmez.`;
}

/**
 * Bir katılımcının analizi için LLM promptu oluşturur.
 */
export function getParticipantAnalysisPrompt(
  name: string,
  stats: ParticipantStats,
  sampleMessages: string[],
  patterns: BehaviorPattern[]
): string {
  const avgResponseStr =
    stats.avgResponseTimeMinutes != null
      ? `${Math.round(stats.avgResponseTimeMinutes)} dakika`
      : 'Bilinmiyor';

  const patternLines = patterns
    .map((p) => `- ${p.label} (${p.score}/100): ${p.description}`)
    .join('\n');

  const messageLines = sampleMessages
    .slice(0, 15)
    .map((m, i) => `${i + 1}. ${m}`)
    .join('\n');

  return `Aşağıdaki WhatsApp sohbet katılımcısını analiz et.

KATILIMCI: ${name}

İSTATİSTİKLER:
- Toplam mesaj: ${stats.messageCount}
- Toplam kelime: ${stats.wordCount}
- Ortalama kelime/mesaj: ${stats.avgWordsPerMessage.toFixed(1)}
- Emoji sayısı: ${stats.emojiCount}
- Medya paylaşımı: ${stats.mediaCount}
- Link paylaşımı: ${stats.linkCount}
- Silinen mesaj: ${stats.deletedCount}
- Soru sayısı: ${stats.questionCount}
- Tek kelimelik mesaj: ${stats.singleWordCount}
- Art arda mesaj rekoru: ${stats.consecutiveMessages}
- Gece mesaj oranı (00-06): %${(stats.nightMessageRatio * 100).toFixed(1)}
- Sohbet başlatma sayısı: ${stats.conversationStartCount}
- Ortalama yanıt süresi: ${avgResponseStr}

DAVRANIŞ KALIPları:
${patternLines || 'Belirgin kalıp tespit edilmedi.'}

ÖRNEK MESAJLAR:
${messageLines || 'Örnek mesaj bulunamadı.'}

## TALİMATLAR
1. Bu kişiyi yukarıdaki verilere dayanarak analiz et.
2. Aşağıdaki formatta DÖRT satır yaz. Her satır belirtilen etiketle başlamalı.
3. TAMAMEN TÜRKÇE yaz. İngilizce veya başka dilde tek kelime bile kullanma.
4. Yazdıktan sonra kontrol et: Eğer Türkçe olmayan bir kelime varsa, onu sil ve Türkçe karşılığını yaz.

LAKAP: [Yaratıcı, komik, tamamen Türkçe bir lakap. Örnek: "Klavye Kralı", "Gece Baykuşu", "Emoji Canavarı"]
KİŞİLİK: [2-3 cümle Türkçe kişilik analizi. Kişinin mesajlaşma alışkanlıklarına dayalı, espirili bir analiz.]
DEDİKODU: [2-3 cümle Türkçe eğlenceli dedikodu. Abartılı ve komik olsun ama kırıcı olmasın.]
UYARI: [1 cümle Türkçe komik uyarı. Bu kişiyle sohbet ederken dikkat edilmesi gereken şey.]`;
}

/**
 * Grup dinamikleri analizi için LLM promptu oluşturur.
 */
export function getGroupAnalysisPrompt(
  participantSummaries: string[],
  groupStats: {
    totalMessages: number;
    dateRange: string;
    participantCount: number;
  }
): string {
  const summaryLines = participantSummaries
    .map((s, i) => `${i + 1}. ${s}`)
    .join('\n');

  return `Aşağıdaki WhatsApp grup sohbetini analiz et.

GRUP İSTATİSTİKLERİ:
- Toplam mesaj: ${groupStats.totalMessages}
- Tarih aralığı: ${groupStats.dateRange}
- Katılımcı sayısı: ${groupStats.participantCount}

KATILIMCI ÖZETLERİ:
${summaryLines}

## TALİMATLAR
1. Grup dinamiklerini analiz et.
2. Aşağıdaki formatta ÜÇ satır yaz. Her satır belirtilen etiketle başlamalı.
3. TAMAMEN TÜRKÇE yaz. İngilizce veya başka dilde tek kelime bile kullanma.
4. Yazdıktan sonra kontrol et: Eğer Türkçe olmayan bir kelime varsa, onu sil ve Türkçe karşılığını yaz.

ÖZET: [Grubun genel havasını ve dinamiklerini anlatan 2-3 cümle Türkçe özet.]
DİNAMİK: [Katılımcılar arasındaki ilişki dinamikleri. Kim kimle daha çok konuşuyor, grupta roller nasıl dağılmış.]
EĞLENCE: [Türkçe eğlenceli bilgi 1] | [Türkçe eğlenceli bilgi 2] | [Türkçe eğlenceli bilgi 3]`;
}

/**
 * LLM yanıtını Türkçe düzeltme promptu.
 * İlk yanıtta yabancı kelime kaldıysa düzeltmek için kullanılır.
 */
export function getReviewPrompt(originalResponse: string): string {
  return `Aşağıdaki metni kontrol et. Eğer İngilizce, Arapça, Çince, Rusça veya Türkçe dışında herhangi bir dilde kelime varsa, o kelimeleri Türkçe karşılıklarıyla değiştir. Eğer tüm metin zaten Türkçe ise, metni aynen yaz.

Kişi isimleri hariç hiçbir yabancı kelime kalmamalı. Formatı (LAKAP:, KİŞİLİK:, DEDİKODU:, UYARI:, ÖZET:, DİNAMİK:, EĞLENCE: etiketlerini) değiştirme. Sadece içerikteki yabancı kelimeleri Türkçeye çevir.

METİN:
${originalResponse}

DÜZELTİLMİŞ METİN:`;
}
