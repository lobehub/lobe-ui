import { useEffect, useState } from 'react';

import { useSpeechRecognition } from './useSpeechRecognition';

export const usePersistedSpeechRecognition = (locale: string) => {
  const [texts, setTexts] = useState<string[]>([]);
  const [isGLobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const { text, stop, start, isLoading } = useSpeechRecognition(locale);

  useEffect(() => {
    if (isGLobalLoading && !isLoading) {
      if (text) setTexts([...texts, text]);
      start();
    }
  }, [isLoading, texts, text, start, isGLobalLoading]);

  return {
    isLoading: isGLobalLoading,
    start: () => {
      setTexts([]);
      setIsGlobalLoading(true);
      start();
    },
    stop: () => {
      stop();
      setIsGlobalLoading(false);
    },
    text: [...texts, text].filter(Boolean).join(','),
  };
};
