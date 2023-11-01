import { useMemo, useState } from 'react';

import { SsmlOptions } from '../utils/genSSML';

export const useSpeechSynthes = (defaultText: string, options: SsmlOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const speechSynthesisUtterance = useMemo(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speechSynthesis.getVoices().find((item) => item.name === options.name) as any;
    if (options.pitch) utterance.pitch = options.pitch;
    if (options.rate) utterance.rate = options.rate;
    return utterance;
  }, [text]);

  speechSynthesisUtterance.onstart = () => setIsProcessing(true);
  speechSynthesisUtterance.onend = () => setIsProcessing(false);

  return {
    isProcessing,
    setText,
    start: () => speechSynthesis.speak(speechSynthesisUtterance),
    stop: () => {
      speechSynthesis.cancel();
      setIsProcessing(false);
    },
  };
};
