import { create } from 'zustand';

interface VoiceState {
  muted: boolean;
  language: 'hi' | 'en' | 'auto';
  speed: 0.7 | 1 | 1.3;
  setMuted: (muted: boolean) => void;
  setLanguage: (language: 'hi' | 'en' | 'auto') => void;
  setSpeed: (speed: 0.7 | 1 | 1.3) => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  muted: false,
  language: 'auto',
  speed: 1,
  setMuted: (muted) => set({ muted }),
  setLanguage: (language) => set({ language }),
  setSpeed: (speed) => set({ speed }),
}));
