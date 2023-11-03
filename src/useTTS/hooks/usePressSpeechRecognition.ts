import { useEffect, useState } from 'react';

import { useSpeechRecognition } from './useSpeechRecognition';

export const usePressSpeechRecognition = (locale: string) => {
  const [texts, setTexts] = useState<string[]>([]);
  const [isGLobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const { text, stop, start, isLoading } = useSpeechRecognition(locale);

  useEffect(() => {
    if (!isLoading && text && texts.at(-1) !== text) {
      setTexts([...texts, text]);
      stop();
      start();
    }
  }, [isLoading, texts, text]);

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
