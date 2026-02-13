// ============================================
// Talkify - TypeScript Type Definitions
// ============================================

// --- WhatsApp Parser Types ---

export type MessageType = 'text' | 'media' | 'system' | 'deleted' | 'link';

export interface ParsedMessage {
  id: string;
  timestamp: Date;
  sender: string;
  content: string;
  type: MessageType;
  isMultiline: boolean;
}

export interface ChatParticipant {
  id: string;
  name: string;
  messageCount: number;
  firstMessage: Date;
  lastMessage: Date;
}

export interface ParsedChat {
  messages: ParsedMessage[];
  participants: ChatParticipant[];
  startDate: Date;
  endDate: Date;
  totalMessages: number;
  chatName: string;
}

export type DateFormatType = 'turkish_24h' | 'turkish_12h' | 'ios_turkish' | 'english';

export interface ParseProgress {
  stage: 'reading' | 'detecting' | 'parsing' | 'classifying' | 'done' | 'error';
  progress: number; // 0-100
  message: string;
  totalLines?: number;
  processedLines?: number;
}

// --- Statistics Types ---

export interface HourlyActivity {
  hour: number;
  count: number;
}

export interface DailyActivity {
  day: number; // 0=Sunday
  count: number;
}

export interface EmojiUsage {
  emoji: string;
  count: number;
}

export interface ParticipantStats {
  participantId: string;
  name: string;
  messageCount: number;
  wordCount: number;
  avgWordsPerMessage: number;
  emojiCount: number;
  uniqueEmojis: EmojiUsage[];
  mediaCount: number;
  linkCount: number;
  deletedCount: number;
  hourlyActivity: HourlyActivity[];
  dailyActivity: DailyActivity[];
  avgResponseTimeMinutes: number | null;
  longestMessage: string;
  shortestMessage: string;
  firstMessageDate: Date;
  lastMessageDate: Date;
  questionCount: number;
  singleWordCount: number;
  consecutiveMessages: number; // max streak
  nightMessageRatio: number; // 00:00-06:00
  conversationStartCount: number;
}

export interface ChatStatistics {
  totalMessages: number;
  totalWords: number;
  totalEmojis: number;
  totalMedia: number;
  totalLinks: number;
  totalDeleted: number;
  dateRange: { start: Date; end: Date };
  participantStats: ParticipantStats[];
  hourlyHeatmap: HourlyActivity[];
  dailyHeatmap: DailyActivity[];
  mostActiveDay: { date: string; count: number };
  mostActiveHour: { hour: number; count: number };
  topEmojis: EmojiUsage[];
}

// --- Behavior Pattern Types ---

export type BehaviorPatternType =
  | 'gece_kusu'        // Night owl
  | 'monolog_krali'    // Monologue king
  | 'hayalet'          // Ghost (slow responder)
  | 'emoji_ustasi'     // Emoji master
  | 'sohbet_atesleyici'// Conversation starter
  | 'tek_kelimelik'    // One-word replier
  | 'link_bombardimanci' // Link bomber
  | 'soru_makinesi'    // Question machine
  | 'roman_yazari'     // Novel writer (long messages)
  | 'sessiz_okuyucu'   // Silent reader (low activity)
  | 'sabahci'          // Early bird
  | 'medya_delisi';    // Media fanatic

export interface BehaviorPattern {
  type: BehaviorPatternType;
  label: string;
  description: string;
  icon: string;
  score: number; // 0-100 strength
}

// --- LLM Types ---

export type LLMProviderType = 'groq';

export interface LLMConfig {
  provider: LLMProviderType;
  groqApiKey: string;
  groqModel: string;
  temperature: number;
  maxTokens: number;
}

export interface LLMProvider {
  type: LLMProviderType;
  isAvailable(): Promise<boolean>;
  initialize(config: LLMConfig): Promise<void>;
  complete(prompt: string, systemPrompt?: string): Promise<string>;
  release(): Promise<void>;
}

export interface ParticipantAnalysis {
  participantId: string;
  name: string;
  nickname: string;
  personality: string;
  gossip: string;
  warning: string;
  behaviorPatterns: BehaviorPattern[];
}

export interface GroupAnalysis {
  summary: string;
  dynamics: string;
  funFacts: string[];
}

export interface AnalysisResult {
  chatId: string;
  timestamp: Date;
  participants: ParticipantAnalysis[];
  group: GroupAnalysis | null;
  isComplete: boolean;
}

// --- Store Types ---

export interface ChatState {
  currentChat: ParsedChat | null;
  parseProgress: ParseProgress | null;
  fileName: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AnalysisState {
  statistics: ChatStatistics | null;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  analysisProgress: number;
  error: string | null;
}

export interface SettingsState {
  llmConfig: LLMConfig;
  language: 'tr';
}

export interface LLMState {
  isConnected: boolean;
  isGenerating: boolean;
  currentModel: string | null;
  availableModels: string[];
  error: string | null;
}
