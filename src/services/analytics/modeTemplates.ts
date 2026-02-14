// ============================================
// Talkify - Mode-Based Analysis Templates
// ============================================
// Each analysis mode has its own tone, nicknames,
// warnings, personality style, gossip style, and group analysis style.

import type { AnalysisMode, Language, BehaviorPatternType } from '@/src/types';

// ---- Nickname Map ----
// Maps mode × pattern → nickname options per language

export const NICKNAME_MAP: Record<AnalysisMode, Record<string, { tr: string[]; en: string[] }>> = {
  falci_teyze: {
    gece_kusu: { tr: ['Ay Işığının Çocuğu', 'Gece Falı', 'Yıldız Kaçığı', 'Karanlığın Kahini', 'Gecenin Sırrı'], en: ['Moonchild', 'Night Oracle', 'Stargazer', 'Dark Seer', 'Night Mystery'] },
    monolog_krali: { tr: ['Fincanın Dibi', 'Kahve Seli', 'Fal Taşıran', 'Bitmez Fal', 'Telveden Çıkan'], en: ['Cup\'s Bottom', 'Coffee Flood', 'Overflowing Fortune', 'Endless Reading', 'From the Grounds'] },
    hayalet: { tr: ['Sisler İçindeki', 'Kayıp Burç', 'Bulanık Fincan', 'Gizli Yıldız', 'Puslu Fal'], en: ['In the Mist', 'Lost Zodiac', 'Cloudy Cup', 'Hidden Star', 'Foggy Fortune'] },
    emoji_ustasi: { tr: ['Yıldızların Çocuğu', 'Sembol Falcısı', 'Burç Emojisi', 'Renkli Fincan', 'İşaret Okuyucu'], en: ['Child of Stars', 'Symbol Reader', 'Zodiac Emoji', 'Colorful Cup', 'Sign Reader'] },
    sohbet_atesleyici: { tr: ['Kıvılcım Falı', 'Ateş Burcu', 'Fincanı Karıştıran', 'Falın Başlatıcısı', 'Sıcak Kahve'], en: ['Spark Fortune', 'Fire Sign', 'Cup Stirrer', 'Fortune Starter', 'Hot Coffee'] },
    tek_kelimelik: { tr: ['Tek Çizgi Falı', 'Sessiz Burç', 'Kısa Kehanet', 'Tek Damla', 'Öz Fal'], en: ['Single Line Fortune', 'Silent Sign', 'Brief Prophecy', 'One Drop', 'Essence Fortune'] },
    link_bombardimanci: { tr: ['İnternet Falcısı', 'Dijital Kahin', 'Link Burcu', 'Sanal Sezgi', 'URL Falı'], en: ['Internet Oracle', 'Digital Seer', 'Link Sign', 'Virtual Intuition', 'URL Fortune'] },
    soru_makinesi: { tr: ['Meraklı Burç', 'Soru Falcısı', 'Fincan Dedektifi', 'Kahin Çırağı', 'Sezgi Avcısı'], en: ['Curious Sign', 'Question Oracle', 'Cup Detective', 'Seer Apprentice', 'Intuition Hunter'] },
    roman_yazari: { tr: ['Uzun Fal', 'Destan Burcu', 'Bitmeyen Kehanet', 'Fal Romanı', 'Detaylı Fincan'], en: ['Long Fortune', 'Epic Sign', 'Endless Prophecy', 'Fortune Novel', 'Detailed Cup'] },
    sessiz_okuyucu: { tr: ['Gizli Fincan', 'Sessiz Kehanet', 'Pusudan Bakan', 'Gizemli Burç', 'Okunan Fal'], en: ['Hidden Cup', 'Silent Prophecy', 'Lurking Seer', 'Mysterious Sign', 'Read Fortune'] },
    sabahci: { tr: ['Güneş Burcu', 'Sabah Falı', 'Şafak Kahini', 'Erken Kehanet', 'Aydınlık Fincan'], en: ['Sun Sign', 'Morning Fortune', 'Dawn Seer', 'Early Prophecy', 'Bright Cup'] },
    medya_delisi: { tr: ['Görüntü Falcısı', 'Fotoğraf Burcu', 'Görsel Kahin', 'Resimli Fal', 'Galeri Falı'], en: ['Image Oracle', 'Photo Sign', 'Visual Seer', 'Pictured Fortune', 'Gallery Fortune'] },
  },

  psikolog: {
    gece_kusu: { tr: ['Noktürnal Birey', 'Gece Aktif Profil', 'Sirkadiyen Kaymacı', 'Geç Tip Kişilik', 'Karanlık Saat Bağımlısı'], en: ['Nocturnal Individual', 'Night-Active Profile', 'Circadian Shifter', 'Late-Type Personality', 'Dark Hour Dependent'] },
    monolog_krali: { tr: ['Kompulsif Paylaşımcı', 'Aşırı Dışavurumcu', 'Sürekli Aktarımcı', 'Monolog Eğilimli', 'Tek Yönlü İletişimci'], en: ['Compulsive Sharer', 'Over-Expressor', 'Continuous Transmitter', 'Monologue-Prone', 'One-Way Communicator'] },
    hayalet: { tr: ['Kaçınan Bağlanma', 'Yanıt Gecikmeli', 'Mesafeli Birey', 'İletişim Kaçınıcı', 'Gecikme Profili'], en: ['Avoidant Attachment', 'Delayed Responder', 'Distant Individual', 'Communication Avoider', 'Delay Profile'] },
    emoji_ustasi: { tr: ['Sembolik İfadeci', 'Duygu Aktarıcı', 'Non-Verbal Tercihli', 'Emoji Bağımlısı', 'Görsel İletişimci'], en: ['Symbolic Expresser', 'Emotion Transmitter', 'Non-Verbal Preferred', 'Emoji Dependent', 'Visual Communicator'] },
    sohbet_atesleyici: { tr: ['Sosyal Katalizör', 'Grup Aktivatörü', 'İletişim Öncüsü', 'Bağ Kurucu', 'Sosyal Lider'], en: ['Social Catalyst', 'Group Activator', 'Communication Pioneer', 'Bond Builder', 'Social Leader'] },
    tek_kelimelik: { tr: ['Minimal İfadeci', 'Duygusal Ketleyici', 'Kısa Yanıtçı', 'Kapalı İletişimci', 'Öz Aktarımcı'], en: ['Minimal Expresser', 'Emotional Suppressor', 'Brief Responder', 'Closed Communicator', 'Concise Transmitter'] },
    link_bombardimanci: { tr: ['Bilgi Paylaşımcısı', 'Referans Bağımlısı', 'Kaynak Yönlendirici', 'Dış Otoriteci', 'Dijital Aktarıcı'], en: ['Information Sharer', 'Reference Dependent', 'Source Redirector', 'External Authority', 'Digital Transmitter'] },
    soru_makinesi: { tr: ['Bilişsel Meraklı', 'Sorgulayıcı Tip', 'Analitik Düşünür', 'Cevap Arayıcı', 'Keşifçi Profil'], en: ['Cognitively Curious', 'Questioning Type', 'Analytical Thinker', 'Answer Seeker', 'Explorer Profile'] },
    roman_yazari: { tr: ['Detaycı Anlatıcı', 'Aşırı Paylaşımcı', 'Geniş Aktarımcı', 'Verbal Baskın', 'Narratif Kişilik'], en: ['Detailed Narrator', 'Over-Sharer', 'Extensive Transmitter', 'Verbally Dominant', 'Narrative Personality'] },
    sessiz_okuyucu: { tr: ['Pasif Gözlemci', 'İçe Dönük Profil', 'Sessiz Katılımcı', 'Dinleyici Tip', 'Geri Çekilmiş Birey'], en: ['Passive Observer', 'Introverted Profile', 'Silent Participant', 'Listener Type', 'Withdrawn Individual'] },
    sabahci: { tr: ['Sabah Tipi Kişilik', 'Erken Döngü Profili', 'Matinal Birey', 'Sirkadiyen Uyumlu', 'Gündüz Aktif'], en: ['Morning-Type Personality', 'Early-Cycle Profile', 'Matinal Individual', 'Circadian Aligned', 'Daytime Active'] },
    medya_delisi: { tr: ['Görsel Bağımlı', 'Medya Odaklı', 'Paylaşım Dürtüsü', 'Görüntü Aktarıcı', 'Dijital Belgeleyici'], en: ['Visually Dependent', 'Media-Focused', 'Sharing Impulse', 'Image Transmitter', 'Digital Documenter'] },
  },

  mahalle_abisi: {
    gece_kusu: { tr: ['Gece Kuşu Reis', 'Gece Bekçisi', 'Vampir Gardaş', 'Gece Alemi', 'Baykuş Kanka'], en: ['Night Owl Boss', 'Night Guard', 'Vampire Bro', 'Night Life', 'Owl Buddy'] },
    monolog_krali: { tr: ['Laf Makinesi', 'Konuşma Motoru', 'Dırdırcı Abi', 'Sel Gibi Gelen', 'Susturulamayan Reis'], en: ['Chatter Machine', 'Talk Engine', 'Rambling Bro', 'Flood Guy', 'Unstoppable Boss'] },
    hayalet: { tr: ['Kayıp Kanka', 'Ortadan Kaybolan', 'Hayalet Gardaş', 'Neredesin Abi', 'Gelip Geçen'], en: ['Missing Buddy', 'Vanishing Act', 'Ghost Bro', 'Where You At', 'Come and Go'] },
    emoji_ustasi: { tr: ['Emoji Deli', 'Suratçı Kanka', 'Duygu Seli', 'İfade Ustası', 'Emoji Reis'], en: ['Emoji Freak', 'Smiley Buddy', 'Emotion Flood', 'Expression Master', 'Emoji Boss'] },
    sohbet_atesleyici: { tr: ['Muhabbet Motoru', 'Ateşleyici Abi', 'Kıvılcım Reis', 'Sohbetin Babası', 'İlk Adım Kankası'], en: ['Chat Engine', 'Starter Bro', 'Spark Boss', 'Chat Father', 'First Move Buddy'] },
    tek_kelimelik: { tr: ['Kısa Kesen', 'Tamam Reis', 'Ok Kankası', 'Lafı Uzatmayan', 'Evet-Hayır Abi'], en: ['Short Cutter', 'OK Boss', 'Ok Buddy', 'Brief Bro', 'Yes-No Guy'] },
    link_bombardimanci: { tr: ['Link Kankası', 'İnternet Abisi', 'Paylaşım Reis', 'Google Gardaş', 'URL Bombardımanı'], en: ['Link Buddy', 'Internet Bro', 'Share Boss', 'Google Bro', 'URL Bomber'] },
    soru_makinesi: { tr: ['Soru Soran Abi', 'Meraklı Kanka', 'Dedektif Reis', 'Neden-Niçin', 'Sorgulayıcı Gardaş'], en: ['Question Bro', 'Curious Buddy', 'Detective Boss', 'Why-How', 'Questioning Bro'] },
    roman_yazari: { tr: ['Roman Yazan Abi', 'Kitap Gardaş', 'Uzun Laf Reis', 'Paragraf Kankası', 'Metin Deli'], en: ['Novel Bro', 'Book Buddy', 'Long Text Boss', 'Paragraph Pal', 'Text Freak'] },
    sessiz_okuyucu: { tr: ['Gizli Abi', 'Pusucu Kanka', 'Sessiz Reis', 'Okuyan Gardaş', 'Gölge Abi'], en: ['Stealth Bro', 'Lurker Buddy', 'Silent Boss', 'Reader Bro', 'Shadow Guy'] },
    sabahci: { tr: ['Erken Kalkan Abi', 'Sabahçı Reis', 'Günaydın Kankası', 'Çalar Saat Gardaş', 'Kuş Gibi Abi'], en: ['Early Riser Bro', 'Morning Boss', 'Good Morning Pal', 'Alarm Clock Bro', 'Bird Guy'] },
    medya_delisi: { tr: ['Paparazzi Abi', 'Fotoğrafçı Reis', 'Galeri Kankası', 'Medya Gardaş', 'Çekici Abi'], en: ['Paparazzi Bro', 'Photographer Boss', 'Gallery Buddy', 'Media Bro', 'Snapper Guy'] },
  },

  futbol_aski: {
    gece_kusu: { tr: ['Gece Maçı Oyuncusu', 'Uzatma Dakikası', 'Gece Antrenörü', 'Meşale Taraftarı', 'Gece Derbisi'], en: ['Night Game Player', 'Extra Time', 'Night Coach', 'Flare Fan', 'Night Derby'] },
    monolog_krali: { tr: ['Tek Kişilik Ordu', 'Forvet Tek Başına', 'Solo Gol', 'Bireysel Oyun', 'Kendine Pas'], en: ['One-Man Army', 'Solo Striker', 'Solo Goal', 'Individual Play', 'Self-Pass'] },
    hayalet: { tr: ['Yedek Kulübesi', 'Sakatlık Listesi', 'Kenara Çekilen', 'Görünmez Oyuncu', 'Gölge Forvet'], en: ['Bench Warmer', 'Injury List', 'Sidelined', 'Invisible Player', 'Ghost Striker'] },
    emoji_ustasi: { tr: ['Tribün Şovmeni', 'Gol Sevinci', 'Koreografi Ustası', 'Bayrak Sallayan', 'Sevinç Dansı'], en: ['Stadium Showman', 'Goal Celebration', 'Choreography Master', 'Flag Waver', 'Joy Dance'] },
    sohbet_atesleyici: { tr: ['Kaptan', 'Oyun Kurucu', '10 Numara', 'İlk Vuruş', 'Başlangıç Düdüğü'], en: ['Captain', 'Playmaker', 'Number 10', 'Kick-Off', 'Starting Whistle'] },
    tek_kelimelik: { tr: ['Kaleci', 'Defans Duvarı', 'Stoper', 'Kısa Pas', 'Tek Dokunuş'], en: ['Goalkeeper', 'Defense Wall', 'Center-Back', 'Short Pass', 'One Touch'] },
    link_bombardimanci: { tr: ['Orta Sahacı', 'Asist Kralı', 'Pasör', 'Organizatör', 'Dağıtıcı'], en: ['Midfielder', 'Assist King', 'Passer', 'Organizer', 'Distributor'] },
    soru_makinesi: { tr: ['VAR Hakemi', 'Hakem', 'Kural Kitabı', 'Ofsayt Dedektörü', 'Frikik Uzmanı'], en: ['VAR Referee', 'Referee', 'Rule Book', 'Offside Detector', 'Free Kick Expert'] },
    roman_yazari: { tr: ['Spor Muhabiri', 'Maç Yorumcusu', 'Taktik Tahtası', 'Analiz Masası', 'Detay Hocası'], en: ['Sports Reporter', 'Match Commentator', 'Tactics Board', 'Analysis Desk', 'Detail Coach'] },
    sessiz_okuyucu: { tr: ['Tribün Sessizi', 'Yedek Oyuncu', 'Altyapı', 'Gizli Yetenek', 'Sessiz Golcü'], en: ['Silent Fan', 'Substitute', 'Youth Academy', 'Hidden Talent', 'Silent Scorer'] },
    sabahci: { tr: ['Sabah Antrenmanı', 'Erken Koşucu', 'Isınma Turu', 'Kondisyoncu', 'Fitness Koçu'], en: ['Morning Training', 'Early Runner', 'Warm-Up', 'Fitness Coach', 'Conditioning Pro'] },
    medya_delisi: { tr: ['Basın Toplantısı', 'Kameraman', 'Gol Tekrarı', 'Fotoğraf Anı', 'Sosyal Medya Yıldızı'], en: ['Press Conference', 'Cameraman', 'Goal Replay', 'Photo Moment', 'Social Media Star'] },
  },

  gamer: {
    gece_kusu: { tr: ['Gece Raidi', 'Midnight Grinder', 'Gece Sunucusu', 'AFK Olmayan', 'Night Session'], en: ['Night Raider', 'Midnight Grinder', 'Night Server', 'Never AFK', 'Night Session'] },
    monolog_krali: { tr: ['Spam Botu', 'Chat Flood', 'Mesaj Spammer', 'Makro Kullanıcı', 'Bitmez Buff'], en: ['Spam Bot', 'Chat Flood', 'Message Spammer', 'Macro User', 'Endless Buff'] },
    hayalet: { tr: ['AFK Oyuncu', 'Disconnect', 'Lag Kurbanı', 'Timeout', 'İnaktif Hesap'], en: ['AFK Player', 'Disconnected', 'Lag Victim', 'Timeout', 'Inactive Account'] },
    emoji_ustasi: { tr: ['Emote Spammer', 'Sticker Koleksiyoncusu', 'Reaction Kralı', 'Taunt Master', 'Emoji DPS'], en: ['Emote Spammer', 'Sticker Collector', 'Reaction King', 'Taunt Master', 'Emoji DPS'] },
    sohbet_atesleyici: { tr: ['Lobby Lideri', 'Party Leader', 'Raid Başlatıcı', 'Queue Atan', 'İlk Tıklayan'], en: ['Lobby Leader', 'Party Leader', 'Raid Starter', 'Queue Initiator', 'First Click'] },
    tek_kelimelik: { tr: ['GG Yazıcı', 'Kısa Komut', 'Tek Tuş', '/gg', 'Macro Cevap'], en: ['GG Typer', 'Short Command', 'One Key', '/gg', 'Macro Reply'] },
    link_bombardimanci: { tr: ['Guide Paylaşıcı', 'Wiki Linker', 'Kaynak Botu', 'Patch Notes', 'Bilgi Bankası'], en: ['Guide Sharer', 'Wiki Linker', 'Source Bot', 'Patch Notes', 'Knowledge Base'] },
    soru_makinesi: { tr: ['Newbie', 'Tutorial Modu', 'Help Yazıcı', 'Nasıl Yapılır', 'Quest Tracker'], en: ['Newbie', 'Tutorial Mode', 'Help Typer', 'How-To', 'Quest Tracker'] },
    roman_yazari: { tr: ['Lore Master', 'Hikaye Yazarı', 'Quest Log', 'RPG Anlatıcısı', 'NPC Diyaloğu'], en: ['Lore Master', 'Story Writer', 'Quest Log', 'RPG Narrator', 'NPC Dialogue'] },
    sessiz_okuyucu: { tr: ['Lurker', 'Stealth Mode', 'Invisible Status', 'Ghost Player', 'Pasif Oyuncu'], en: ['Lurker', 'Stealth Mode', 'Invisible Status', 'Ghost Player', 'Passive Player'] },
    sabahci: { tr: ['Daily Quest', 'Sabah Görevi', 'Login Bonus', 'Early Access', 'Günlük Ödül'], en: ['Daily Quest', 'Morning Mission', 'Login Bonus', 'Early Access', 'Daily Reward'] },
    medya_delisi: { tr: ['Screenshot Hunter', 'Clip Paylaşıcı', 'Stream Sniper', 'Highlight Reel', 'Montaj Ustası'], en: ['Screenshot Hunter', 'Clip Sharer', 'Stream Sniper', 'Highlight Reel', 'Montage Master'] },
  },
};

// ---- Warning Map ----

export const WARNING_MAP: Record<AnalysisMode, Record<string, { tr: string[]; en: string[] }>> = {
  falci_teyze: {
    gece_kusu: { tr: ['Falında karanlık görüyorum, gece mesaj atarsa cevap verme kızım.', 'Yıldızlar diyor ki bu kişi gece vakti tehlikeli, uzak dur.'], en: ['I see darkness in your fortune, don\'t reply to their night messages.', 'The stars say this person is dangerous at night, stay away.'] },
    monolog_krali: { tr: ['Fincanında sel var, bu kişi yazmaya başlarsa kaçamazsın.', 'Falda bitmez tükenmez mesajlar görüyorum, sabret kızım.'], en: ['There\'s a flood in their cup, once they start you can\'t escape.', 'I see endless messages in the fortune, be patient dear.'] },
    hayalet: { tr: ['Bu kişinin fincanında sis var, cevap bekleme kızım.', 'Falında kayıp bir ruh görüyorum, mesajına geç döner.'], en: ['There\'s fog in this person\'s cup, don\'t wait for a reply.', 'I see a lost soul in the fortune, they reply late.'] },
    emoji_ustasi: { tr: ['Fincanı sembollerle dolu, kelimelerle anlaşamazsın.', 'Falında renkli işaretler var, emoji sözlüğü gerek.'], en: ['Their cup is full of symbols, you can\'t communicate with words.', 'There are colorful signs in the fortune, you need an emoji dictionary.'] },
    sohbet_atesleyici: { tr: ['Bu kişi olmasa falda hiç hareket olmazdı, kıymetini bil.', 'Yıldızlar diyor ki bu kişi grubun can damarı.'], en: ['Without this person there\'d be no movement in the fortune, appreciate them.', 'The stars say this person is the group\'s lifeline.'] },
    tek_kelimelik: { tr: ['Fincanında tek çizgi var, uzun cevap bekleme.', 'Falında kısa kader çizgisi görüyorum, özlü konuşur.'], en: ['There\'s a single line in their cup, don\'t expect long answers.', 'I see a short fate line, they speak briefly.'] },
    link_bombardimanci: { tr: ['Fincanında çok yol görüyorum, hepsi linke çıkıyor.', 'Falında internet bağlantısı var kızım, her yere link atar.'], en: ['I see many paths in the cup, all lead to links.', 'There\'s an internet connection in the fortune, they share links everywhere.'] },
    soru_makinesi: { tr: ['Bu kişinin fincanında soru işareti bitmez, sorgudan kaçamazsın.', 'Falında merak dolu bir gelecek var, sormadan duramaz.'], en: ['Question marks never end in this cup, you can\'t escape the questioning.', 'There\'s a curious future in the fortune, they can\'t stop asking.'] },
    roman_yazari: { tr: ['Fincanında roman görüyorum, mesajlarını okumak için fala mola ver.', 'Falında uzun bir yolculuk var, mesajları gibi.'], en: ['I see a novel in the cup, take a break to read their messages.', 'There\'s a long journey in the fortune, like their messages.'] },
    sessiz_okuyucu: { tr: ['Bu kişinin fincanı ters, ama her şeyi görüyor, dikkat et.', 'Falında gizli bir güç var, sessiz ama her şeyi biliyor.'], en: ['This person\'s cup is upside down, but they see everything, be careful.', 'There\'s a hidden power in the fortune, silent but knows all.'] },
    sabahci: { tr: ['Sabah falında bu kişi çıkıyor, erken kalkan günaydın mesajı atar.', 'Yıldızlar diyor ki bu kişi sabah alarmsız uyanır.'], en: ['This person appears in the morning fortune, early riser sends good morning.', 'Stars say this person wakes without an alarm.'] },
    medya_delisi: { tr: ['Fincanında çok görüntü var, telefonunun hafızası dolu.', 'Falında fotoğraf yağmuru görüyorum, paparazzi gibi.'], en: ['Lots of images in the cup, their phone storage is full.', 'I see a photo rain in the fortune, like paparazzi.'] },
  },

  psikolog: {
    gece_kusu: { tr: ['Bu bireyde sirkadiyen ritim bozukluğu belirtileri mevcut, gece mesajlarına dikkat.', 'Gece aktif iletişim profili, uyku hijyeni değerlendirilmeli.'], en: ['This individual shows signs of circadian rhythm disruption, note their night messages.', 'Night-active communication profile, sleep hygiene should be evaluated.'] },
    monolog_krali: { tr: ['Kompulsif paylaşım eğilimi gözlemleniyor, sınır koyma becerisi geliştirilmeli.', 'Bu bireyde aşırı dışavurum ve onay arayışı belirtileri mevcut.'], en: ['Compulsive sharing tendency observed, boundary-setting skills need development.', 'Signs of over-expression and approval-seeking are present in this individual.'] },
    hayalet: { tr: ['Bu bireyde avoidant bağlanma eğilimi gözlemleniyor, cevap gecikmelerine hazırlıklı olun.', 'İletişimde kaçınma davranışı belirgin, sabırlı yaklaşım önerilir.'], en: ['Avoidant attachment tendency observed, be prepared for response delays.', 'Communication avoidance behavior is prominent, a patient approach is recommended.'] },
    emoji_ustasi: { tr: ['Verbal ifade yerine sembolik iletişimi tercih ediyor, duygusal ifade kanalı farklı.', 'Non-verbal iletişim tercihi baskın, kelimelerle ifade güçlüğü olabilir.'], en: ['Prefers symbolic over verbal expression, emotional expression channel differs.', 'Non-verbal communication preference is dominant, may have difficulty with verbal expression.'] },
    sohbet_atesleyici: { tr: ['Güçlü sosyal katalizör rolü üstleniyor, grup dinamiklerinin temel taşıyıcısı.', 'Bu birey olmadan grup kohezyon kaybedebilir, kritik sosyal rol.'], en: ['Takes on a strong social catalyst role, key carrier of group dynamics.', 'The group may lose cohesion without this individual, critical social role.'] },
    tek_kelimelik: { tr: ['Minimal ifade tarzı, duygusal ketlenme olasılığı değerlendirilmeli.', 'Kısa yanıt eğilimi, iletişimde derinlik eksikliği gözlemleniyor.'], en: ['Minimal expression style, emotional suppression possibility should be evaluated.', 'Short response tendency, lack of depth in communication observed.'] },
    link_bombardimanci: { tr: ['Dış kaynaklara yönlendirme eğilimi, kendi fikirlerini ifade etmekte güçlük çekiyor olabilir.', 'Bilgi paylaşımı yoluyla bağ kurma stratejisi kullanıyor.'], en: ['Tendency to redirect to external sources, may have difficulty expressing own opinions.', 'Uses information sharing as a bonding strategy.'] },
    soru_makinesi: { tr: ['Yüksek bilişsel merak ve kontrol ihtiyacı gözlemleniyor.', 'Sorgulayıcı iletişim tarzı, belirsizlik toleransı düşük olabilir.'], en: ['High cognitive curiosity and need for control observed.', 'Questioning communication style, uncertainty tolerance may be low.'] },
    roman_yazari: { tr: ['Aşırı paylaşım eğilimi, sınır belirleme güçlüğü olabilir.', 'Detaylı anlatım tarzı, dinlenme ve anlaşılma ihtiyacı yüksek.'], en: ['Over-sharing tendency, may have difficulty with boundaries.', 'Detailed narrative style, high need for being heard and understood.'] },
    sessiz_okuyucu: { tr: ['İçe dönük profil, pasif gözlem tercih ediyor, iletişime zorlamayın.', 'Düşük katılım oranı, sosyal kaygı belirtileri değerlendirilmeli.'], en: ['Introverted profile, prefers passive observation, don\'t force communication.', 'Low participation rate, social anxiety symptoms should be evaluated.'] },
    sabahci: { tr: ['Sağlıklı sirkadiyen ritim, düzenli yaşam alışkanlıkları gösteriyor.', 'Sabah tipi kişilik, yapılandırılmış gün planı tercih ediyor.'], en: ['Healthy circadian rhythm, shows regular lifestyle habits.', 'Morning-type personality, prefers structured daily plans.'] },
    medya_delisi: { tr: ['Görsel paylaşım dürtüsü yüksek, anı belgeleme ihtiyacı mevcut.', 'Dijital belgeleme eğilimi, deneyimleri paylaşarak anlam katıyor.'], en: ['High visual sharing impulse, need for moment documentation present.', 'Digital documentation tendency, adds meaning by sharing experiences.'] },
  },

  mahalle_abisi: {
    gece_kusu: { tr: ['Gardaşım bu kafayla devam edersen sabaha sağ çıkamazsın.', 'Gece gece mesaj atıyor, uyumayı bilmiyor bu kanka.'], en: ['Bro, if you keep this up you won\'t make it to morning.', 'Texting at night, this buddy doesn\'t know how to sleep.'] },
    monolog_krali: { tr: ['Bu abimiz yazmaya başlarsa telefonunu bırakma, bitmez.', 'Kankam bir kere ağzını açtı mı susmak bilmiyor.'], en: ['Once this guy starts typing, don\'t put down your phone, it never ends.', 'Once this buddy opens their mouth, they don\'t know how to shut up.'] },
    hayalet: { tr: ['Bu gardaşa acil mesaj gönderme, cevap gelene kadar emekli olursun.', 'Kankam mesajı görüp kaçıyor, yakalayamazsın.'], en: ['Don\'t send urgent texts to this bro, you\'ll retire waiting for a reply.', 'Buddy sees the message and runs, you can\'t catch them.'] },
    emoji_ustasi: { tr: ['Bu kankam kelime bilmiyor, emoji dili konuşuyor.', 'Gardaşım Türkçe konuş, emoji sözlüğüm yok benim.'], en: ['This buddy doesn\'t know words, speaks emoji language.', 'Bro speak Turkish, I don\'t have an emoji dictionary.'] },
    sohbet_atesleyici: { tr: ['Bu abi olmasa grup ölü, değerini bilin arkadaşlar.', 'Kankam tek başına grubu ayakta tutuyor, helal olsun.'], en: ['Without this guy the group is dead, appreciate them folks.', 'Buddy keeps the group alive single-handedly, respect.'] },
    tek_kelimelik: { tr: ['Bu abiden "tamam"dan uzun cevap almak mucize.', 'Kankam iki kelime yazmaya üşeniyor, enerji tasarrufu yapıyor.'], en: ['Getting more than "ok" from this guy is a miracle.', 'Buddy is too lazy to type two words, saving energy.'] },
    link_bombardimanci: { tr: ['Bu gardaş Google maaşlı herhalde, her şeye link buluyor.', 'Kankam her konuşmaya linkle giriyor, Wikipedia editörü olabilir.'], en: ['This bro must be on Google\'s payroll, finds a link for everything.', 'Buddy enters every conversation with a link, might be a Wikipedia editor.'] },
    soru_makinesi: { tr: ['Bu abimiz savcı mı dedektif mi belli değil ama sorguluyor.', 'Kankam soru sormadan duramıyor, FBI mülakatı gibi.'], en: ['Can\'t tell if this guy is a prosecutor or detective, but they\'re interrogating.', 'Buddy can\'t stop asking questions, like an FBI interview.'] },
    roman_yazari: { tr: ['Bu kankam mesaj değil roman yazıyor, okumak için izin günü al.', 'Gardaşım kısa bir soru sor, 3 paragraf cevap gelir.'], en: ['This buddy doesn\'t write messages, they write novels, take a day off to read.', 'Bro ask a short question, you\'ll get 3 paragraphs back.'] },
    sessiz_okuyucu: { tr: ['Bu abi sessiz ama her şeyi okuyor, dikkat et ne yazıyorsun.', 'Kankam grubun gizli ajanı, sessiz ama bilgili.'], en: ['This guy is silent but reads everything, watch what you type.', 'Buddy is the group\'s secret agent, quiet but informed.'] },
    sabahci: { tr: ['Bu gardaş sabah 6da mesaj atarsa şaşırma, alışkanlık.', 'Kankam günaydın mesajlarıyla alarm niyetine kullanılıyor.'], en: ['Don\'t be surprised if this bro texts at 6 AM, it\'s a habit.', 'Buddy\'s good morning messages are used as alarm clocks.'] },
    medya_delisi: { tr: ['Bu abinin telefonunun hafızası hep dolu, suçlu bu kanka.', 'Gardaşım her anı fotoğraflamadan edemiyor, paparazzi gibi.'], en: ['This guy\'s phone storage is always full, it\'s this buddy\'s fault.', 'Bro can\'t stop photographing every moment, like paparazzi.'] },
  },

  futbol_aski: {
    gece_kusu: { tr: ['Bu oyuncu gece maçlarında parlıyor ama gündüz kayıp, dikkat.', 'Uzatma dakikalarının oyuncusu, gece mesajlarına hazır ol.'], en: ['This player shines in night games but disappears in daytime, watch out.', 'Extra time player, be ready for night messages.'] },
    monolog_krali: { tr: ['Bu oyuncu topu bırakmıyor, bireysel oynuyor dikkat!', 'Takım oyununu bilmiyor, sürekli tek başına atağa kalkıyor.'], en: ['This player won\'t give up the ball, playing individually, watch out!', 'Doesn\'t know team play, constantly attacking solo.'] },
    hayalet: { tr: ['Bu oyuncu penaltı kaçırır dikkat, kritik anda kaybolur.', 'Sakatlık listesinde gibi, maça çıkmıyor bu oyuncu.'], en: ['This player might miss penalties, disappears at critical moments.', 'Seems like they\'re on the injury list, not showing up for matches.'] },
    emoji_ustasi: { tr: ['Tribünü coşturan koreografici, ama oyuna odaklansın.', 'Gol sevinci güzel ama önce gol at bakalım.'], en: ['Stadium choreographer exciting the stands, but should focus on the game.', 'Nice goal celebration but first score a goal.'] },
    sohbet_atesleyici: { tr: ['Kaptanın bandını hak ediyor, takımı o yönetiyor.', 'Bu oyuncu olmasa takım sahaya çıkamaz, kritik transfer.'], en: ['Deserves the captain\'s armband, they lead the team.', 'Without this player the team can\'t take the field, critical transfer.'] },
    tek_kelimelik: { tr: ['Kaleci gibi, az konuşur ama kritik anlarda orada.', 'Kısa pas oynuyor, uzun toplardan kaçınıyor.'], en: ['Like a goalkeeper, speaks little but there at critical moments.', 'Plays short passes, avoids long balls.'] },
    link_bombardimanci: { tr: ['Asist kralı, sürekli başkalarına pas atıyor.', 'Orta sahanın patronu, her tarafa organize ediyor.'], en: ['Assist king, constantly passing to others.', 'Midfield boss, organizing everywhere.'] },
    soru_makinesi: { tr: ['VAR hakemi gibi, her pozisyonu sorguluyor.', 'Bu oyuncu hakemle tartışmadan duramıyor.'], en: ['Like a VAR referee, questions every position.', 'This player can\'t stop arguing with the referee.'] },
    roman_yazari: { tr: ['Spor muhabiri gibi, her pozisyonu detaylı anlatıyor.', 'Maç yorumcusu olmalıydı, mesajları maç analizi gibi.'], en: ['Like a sports reporter, describes every play in detail.', 'Should have been a match commentator, messages like match analysis.'] },
    sessiz_okuyucu: { tr: ['Yedek kulübesinde ama her şeyi takip ediyor.', 'Gizli yetenek, fırsat verilirse gol kralı olabilir.'], en: ['On the bench but following everything.', 'Hidden talent, could be top scorer if given a chance.'] },
    sabahci: { tr: ['Sabah antrenmanının yıldızı, erken kalkan kondisyon kazanır.', 'Isınma turlarının kralı, herkesten önce sahada.'], en: ['Star of morning training, early riser gains fitness.', 'King of warm-up laps, on the field before everyone.'] },
    medya_delisi: { tr: ['Basın toplantısı uzmanı, kamera açısını bilir.', 'Sosyal medya yıldızı, sahada da böyle parlasa keşke.'], en: ['Press conference expert, knows the camera angle.', 'Social media star, wish they shone this bright on the field.'] },
  },

  gamer: {
    gece_kusu: { tr: ['Bu oyuncu rage quit edebilir, gece raidlerinden uzak dur.', 'Gece sessionları sert geçer, flame\'e hazır ol.'], en: ['This player might rage quit, stay away from night raids.', 'Night sessions get intense, prepare for flame.'] },
    monolog_krali: { tr: ['Chat spam yapıyor, mute\'lamayı düşün.', 'Bu oyuncunun chat\'i kapatılmalı, flood yapıyor.'], en: ['Spamming the chat, consider muting.', 'This player\'s chat should be disabled, they\'re flooding.'] },
    hayalet: { tr: ['AFK gidiyor, raid sırasında disconnect olabilir.', 'Bu oyuncu lag bahanesiyle kayboluyor, güvenme.'], en: ['Goes AFK, might disconnect during raids.', 'This player disappears with lag as an excuse, don\'t trust them.'] },
    emoji_ustasi: { tr: ['Emote spam yapıyor, oyuna odaklansın.', 'Reaction atma hızı DPS\'inden yüksek.'], en: ['Spamming emotes, should focus on the game.', 'Reaction speed higher than their DPS.'] },
    sohbet_atesleyici: { tr: ['Lobby\'nin lideri, bu oyuncu olmasa party kurulamaz.', 'Raid başlatıcısı, herkes buna bağımlı.'], en: ['Lobby leader, can\'t form a party without this player.', 'Raid starter, everyone depends on them.'] },
    tek_kelimelik: { tr: ['"GG" yazmaktan başka bir şey bilmiyor.', 'Makro kullanıyor gibi, hep aynı kısa cevaplar.'], en: ['Doesn\'t know anything other than typing "GG".', 'Seems like using macros, always the same short replies.'] },
    link_bombardimanci: { tr: ['Guide paylaşma bağımlısı, kendi oynasın biraz.', 'Wiki linker, her soruya link atıyor oyun yerine.'], en: ['Addicted to sharing guides, should play a bit themselves.', 'Wiki linker, sends links for every question instead of playing.'] },
    soru_makinesi: { tr: ['Newbie gibi soru soruyor, tutorial\'ı atlamış.', 'Help yazmaktan oyun oynayamıyor.'], en: ['Asking questions like a newbie, skipped the tutorial.', 'Can\'t play the game because they\'re too busy typing help.'] },
    roman_yazari: { tr: ['Lore master, oyunun hikayesini 3 paragrafta anlatıyor.', 'NPC diyaloğu gibi mesaj yazıyor, skip butonuna basasım geliyor.'], en: ['Lore master, explains the game story in 3 paragraphs.', 'Writes messages like NPC dialogue, makes me want to press skip.'] },
    sessiz_okuyucu: { tr: ['Stealth modda, ama logları okuyor, dikkat et.', 'Invisible status ama online, creepy.'], en: ['In stealth mode, but reading logs, be careful.', 'Invisible status but online, creepy.'] },
    sabahci: { tr: ['Daily quest grinder, sabah sabah login bonus topluyor.', 'Early access çılgını, herkes uyurken leveling yapıyor.'], en: ['Daily quest grinder, collecting login bonus early morning.', 'Early access fanatic, leveling while everyone sleeps.'] },
    medya_delisi: { tr: ['Screenshot hunter, her anı kayıt altına alıyor.', 'Stream sniper olabilir, kameradan kaçamazsın.'], en: ['Screenshot hunter, recording every moment.', 'Might be a stream sniper, you can\'t escape the camera.'] },
  },
};

// ---- Stat-Based Fallback Nicknames ----

export const STAT_NICKNAMES: Record<AnalysisMode, { condition: string; tr: string; en: string }[]> = {
  falci_teyze: [
    { condition: 'most_messages', tr: 'Parlak Yıldız', en: 'Bright Star' },
    { condition: 'least_messages', tr: 'Gizli Burç', en: 'Hidden Sign' },
    { condition: 'high_emoji', tr: 'Renkli Fincan', en: 'Colorful Cup' },
    { condition: 'high_question', tr: 'Meraklı Kahin', en: 'Curious Seer' },
    { condition: 'high_avg_words', tr: 'Derin Fal', en: 'Deep Fortune' },
    { condition: 'default', tr: 'Fincanın Ortası', en: 'Middle of the Cup' },
  ],
  psikolog: [
    { condition: 'most_messages', tr: 'Dominant Birey', en: 'Dominant Individual' },
    { condition: 'least_messages', tr: 'İçe Dönük Profil', en: 'Introverted Profile' },
    { condition: 'high_emoji', tr: 'Duygusal İfadeci', en: 'Emotional Expresser' },
    { condition: 'high_question', tr: 'Analitik Düşünür', en: 'Analytical Thinker' },
    { condition: 'high_avg_words', tr: 'Detaycı Anlatıcı', en: 'Detailed Narrator' },
    { condition: 'default', tr: 'Dengeli Katılımcı', en: 'Balanced Participant' },
  ],
  mahalle_abisi: [
    { condition: 'most_messages', tr: 'Reis', en: 'Boss' },
    { condition: 'least_messages', tr: 'Sessiz Gardaş', en: 'Quiet Bro' },
    { condition: 'high_emoji', tr: 'Suratçı Kanka', en: 'Smiley Buddy' },
    { condition: 'high_question', tr: 'Meraklı Abi', en: 'Curious Bro' },
    { condition: 'high_avg_words', tr: 'Lafçı Kanka', en: 'Talker Buddy' },
    { condition: 'default', tr: 'Kankamız', en: 'Our Buddy' },
  ],
  futbol_aski: [
    { condition: 'most_messages', tr: 'Gol Kralı', en: 'Top Scorer' },
    { condition: 'least_messages', tr: 'Yedek Oyuncu', en: 'Substitute' },
    { condition: 'high_emoji', tr: 'Tribün Şovmeni', en: 'Stadium Showman' },
    { condition: 'high_question', tr: 'Teknik Direktör', en: 'Coach' },
    { condition: 'high_avg_words', tr: 'Spor Muhabiri', en: 'Sports Reporter' },
    { condition: 'default', tr: 'Orta Saha', en: 'Midfielder' },
  ],
  gamer: [
    { condition: 'most_messages', tr: 'Level 99 Boss', en: 'Level 99 Boss' },
    { condition: 'least_messages', tr: 'AFK Oyuncu', en: 'AFK Player' },
    { condition: 'high_emoji', tr: 'Emote Spammer', en: 'Emote Spammer' },
    { condition: 'high_question', tr: 'Newbie', en: 'Newbie' },
    { condition: 'high_avg_words', tr: 'Lore Master', en: 'Lore Master' },
    { condition: 'default', tr: 'Casual Gamer', en: 'Casual Gamer' },
  ],
};

// ---- Personality Prefixes ----

export const PERSONALITY_PREFIX: Record<AnalysisMode, Record<Language, string>> = {
  falci_teyze: {
    tr: 'Fincanına baktığımda görüyorum ki, ',
    en: 'Looking into the cup, I see that ',
  },
  psikolog: {
    tr: 'Klinik gözlemlerime göre, ',
    en: 'Based on my clinical observations, ',
  },
  mahalle_abisi: {
    tr: 'Gardaşım sana söyleyeyim, ',
    en: 'Let me tell you buddy, ',
  },
  futbol_aski: {
    tr: 'Bu oyuncunun performans analizi: ',
    en: 'This player\'s performance analysis: ',
  },
  gamer: {
    tr: 'Oyuncu profil analizi: ',
    en: 'Player profile analysis: ',
  },
};

// ---- Gossip Prefixes ----

export const GOSSIP_PREFIX: Record<AnalysisMode, Record<Language, string>> = {
  falci_teyze: {
    tr: 'Fincanda gördüklerim: ',
    en: 'What I see in the cup: ',
  },
  psikolog: {
    tr: 'Klinik notlar: ',
    en: 'Clinical notes: ',
  },
  mahalle_abisi: {
    tr: 'Kulağıma gelenler: ',
    en: 'What I heard: ',
  },
  futbol_aski: {
    tr: 'Soyunma odası dedikoduları: ',
    en: 'Locker room gossip: ',
  },
  gamer: {
    tr: 'Server dedikoduları: ',
    en: 'Server gossip: ',
  },
};

// ---- Group Analysis Templates ----

export const GROUP_SUMMARY_PREFIX: Record<AnalysisMode, Record<Language, string>> = {
  falci_teyze: {
    tr: 'Bu grubun fincanını açtığımda gördüm ki, ',
    en: 'When I opened this group\'s cup I saw that, ',
  },
  psikolog: {
    tr: 'Grup dinamikleri analiz raporu: ',
    en: 'Group dynamics analysis report: ',
  },
  mahalle_abisi: {
    tr: 'Bu mahallede neler oluyor anlatayım: ',
    en: 'Let me tell you what\'s going on in this neighborhood: ',
  },
  futbol_aski: {
    tr: 'Takım genel performans raporu: ',
    en: 'Team overall performance report: ',
  },
  gamer: {
    tr: 'Guild/Clan raporu: ',
    en: 'Guild/Clan report: ',
  },
};

// ---- Helper: get pattern type as string key ----

export function getPatternKey(type: BehaviorPatternType): string {
  return type as string;
}
