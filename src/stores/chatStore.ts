import { create } from 'zustand';
import type { ChatState, ParsedChat, ParseProgress } from '@/src/types';

interface ChatActions {
  setChat: (chat: ParsedChat | null) => void;
  setProgress: (progress: ParseProgress | null) => void;
  setFileName: (fileName: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: ChatState = {
  currentChat: null,
  parseProgress: null,
  fileName: null,
  isLoading: false,
  error: null,
};

export const useChatStore = create<ChatState & ChatActions>()((set) => ({
  ...initialState,

  setChat: (chat) => set({ currentChat: chat, error: null }),
  setProgress: (progress) => set({ parseProgress: progress }),
  setFileName: (fileName) => set({ fileName }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set(initialState),
}));
