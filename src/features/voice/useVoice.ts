import { useState } from 'react';
import { voiceQueries } from '@/data/demoAppData';
import { geminiClient } from '@/lib/gemini';
import type { VoiceResponse } from '@/types/insights.types';

const fallbackResponse: VoiceResponse = {
  answer: 'I could not match that exact merchant question in demo mode, but I can still route you to the right workflow. Try asking about today\'s collection, dispute timelines, or a payment verification.',
  dataPoints: [{ label: 'Mode', value: 'Demo', type: 'status' }],
  suggestedActions: [
    { label: 'Open verifier', route: '/app/verify' },
    { label: 'Open analytics', route: '/app/analytics' },
  ],
  confidence: 'medium',
};

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<VoiceResponse | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const startListening = () => {
    setIsListening(true);
    window.setTimeout(() => {
      setTranscript('Aaj kitna collected hua');
      setIsListening(false);
    }, 1800);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const handleQuery = async (query: string) => {
    setTranscript(query);
    setIsThinking(true);
    setResponse(null);
    await new Promise((resolve) => window.setTimeout(resolve, 1400));
    const normalized = query.trim().toLowerCase();
    const apiResponse = await geminiClient.answerMerchantQuery(normalized).catch(() => undefined);
    setResponse(apiResponse ?? voiceQueries[normalized] ?? fallbackResponse);
    setIsThinking(false);
  };

  return { isListening, transcript, setTranscript, response, isThinking, startListening, stopListening, handleQuery };
}
