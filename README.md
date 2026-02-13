<p align="center">
  <img src="assets/logo/logo.png" width="120" alt="Talkify Logo" />
</p>

<h1 align="center">Talkify</h1>

<p align="center">
  <strong>WhatsApp sohbet analizini eğlenceli hale getiren mobil uygulama</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo_SDK-54-blue?logo=expo" alt="Expo SDK 54" />
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Groq-LLM_API-orange" alt="Groq" />
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-green" alt="Platform" />
</p>

---

## Ne Yapar?

WhatsApp'tan disa aktardiginiz sohbet dosyasini yukleyin, Talkify gerisini halletsin:

- **Lakap Takma** — Her katilimciya mesajlasma tarzina gore yaratici ve komik lakaplar
- **Kisilik Analizi** — Mesaj istatistiklerine dayali espirili kisilik profili
- **Dedikodu Uretimi** — Abartili ama eglenceli dedikodular
- **Grup Dinamikleri** — Kim kimle daha cok konusuyor, roller nasil dagilmis
- **Detayli Istatistikler** — Mesaj sayilari, emoji kullanimi, saatlik aktivite grafigi, davranis kaliplari

## Ozellikler

| Ozellik | Aciklama |
|---------|----------|
| WhatsApp Parser | Turkce 24h, 12h (OO/OS), iOS Turkce ve Ingilizce tarih formatlarini destekler |
| Groq AI Entegrasyonu | Hizli analiz icin Groq Cloud API (Llama 3.3 70B) |
| 12 Davranis Kalibi | Gece Kusu, Emoji Ustasi, Roman Yazari, Hayalet ve daha fazlasi |
| Kopyala & Paylas | Analiz sonuclarini tek tikla kopyalayip paylasin |
| Turkce Arayuz | Tamamen Turkce kullanici deneyimi |
| Renkli Tasarim | Her sekme kendine ozel renkli ikonlarla canli bir arayuz |

## Mimari

```
src/
├── components/
│   ├── ui/              # Button, Card, Typography, ProgressBar, StatCard
│   ├── analysis/        # ParticipantCard, GossipBubble, NicknameReveal
│   ├── chat/            # FileUploader, ChatPreview, ParseProgress
│   └── statistics/      # HourlyChart, EmojiCloud, ParticipantList, StatsSummary
├── services/
│   ├── parser/          # WhatsApp chat parser (tarih desenleri, mesaj siniflandirma)
│   ├── analytics/       # Istatistik motoru + davranis kaliplari
│   └── llm/             # Groq provider, prompt sablonlari, yanit ayristirici
├── stores/              # Zustand state yonetimi (chat, analysis, settings, llm)
├── hooks/               # useLLMAnalysis, useWhatsAppParser, useStatistics, useTheme
├── constants/           # Tema renkleri, Turkce string'ler
└── types/               # TypeScript tip tanimlari

app/
├── (tabs)/
│   ├── index.tsx        # Ana Sayfa — dosya yukleme
│   ├── analysis.tsx     # Analiz — AI sonuclari
│   ├── statistics.tsx   # Istatistik — grafikler ve sayilar
│   └── settings.tsx     # Gizlilik — bilgilendirme
└── chat-detail/
    └── [participantId]  # Katilimci detay sayfasi
```

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navigasyon | expo-router v6 (dosya tabanli) |
| State | Zustand v5 + AsyncStorage persist |
| LLM | Groq Cloud API (OpenAI uyumlu) |
| Dil | TypeScript 5.9 |
| Dosya Sistemi | expo-file-system v19 (`File` class API) |
| Ikon | @expo/vector-icons (FontAwesome) |

## Kurulum

### Gereksinimler

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- [Groq API anahtari](https://console.groq.com/) (ucretsiz)

### Adimlar

```bash
# Repo'yu klonlayin
git clone https://github.com/alperyardimci/talkify.git
cd talkify

# Bagimliliklari yukleyin
npm install

# Groq API anahtarinizi ekleyin
echo "GROQ_API_KEY=gsk_your_key_here" > .env

# Uygulamayi baslatn
npx expo start
```

> **Not:** `.env` dosyasindaki API anahtari `app.config.ts` uzerinden otomatik olarak uygulamaya aktarilir.

### Simulator / Cihaz

- **iOS:** `npx expo start --ios`
- **Android:** `npx expo start --android`
- **Expo Go:** QR kodu okutarak fiziksel cihazda test edin

## Kullanim

1. **Sohbeti disa aktarin:** WhatsApp > Sohbet > Disa Aktar > Medyasiz
2. **Dosyayi yukleyin:** Ana sayfada "Dosya Sec" butonuna tiklayin
3. **Istatistikleri goruntuleyin:** Istatistik sekmesinde mesaj dagilimi, emoji bulutu, saatlik aktivite
4. **Analizi baslatin:** "Analizi Baslat" butonuyla AI analizini tetikleyin
5. **Paylasin:** Analiz sonuclarini kopyala ikonu ile panomuza alin

## Davranis Kaliplari

Talkify her katilimci icin 12 farkli davranis kalibi tespit eder:

| Kalip | Aciklama |
|-------|----------|
| Gece Kusu | Gece yarisından sonra aktif |
| Monolog Krali | Ust uste cok mesaj gonderen |
| Hayalet | Yavas yanit veren |
| Emoji Ustasi | Bol emoji kullanan |
| Sohbet Atesleyici | Konusmalari baslatan |
| Tek Kelimelik | Kisa yanitlar veren |
| Link Bombardimancisi | Surekli link paylasan |
| Soru Makinesi | Cok soru soran |
| Roman Yazari | Uzun mesajlar yazan |
| Sessiz Okuyucu | En az aktif uye |
| Sabahci | Sabah saatlerinde aktif |
| Medya Delisi | Bol foto/video paylasan |

## Gizlilik

- Sohbet verileri analiz icin Groq sunucularina gonderilir
- Groq verileri saklamaz veya model egitiminde kullanmaz
- Uygulama icinde veri kalici olarak depolanmaz (AsyncStorage sadece oturum suresi)
- Hicbir veri ucuncu taraflarla paylasilmaz

## Lisans

MIT

---

<p align="center">
  <sub>Talkify ile sohbetlerini kesfet</sub>
</p>
