import { useMemo, useState } from 'react';

import { SsmlOptions } from '../utils/genSSML';

export const useSpeechSynthes = (defaultText: string, options: SsmlOptions) => {
  const [voiceList, setVoiceList] = useState(speechSynthesis.getVoices());
  const [text, setText] = useState<string>(defaultText);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const speechSynthesisUtterance = useMemo(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voiceList.find((item) => item.name === options.name) as any;
    if (options.pitch) utterance.pitch = options.pitch;
    if (options.rate) utterance.rate = options.rate;
    return utterance;
  }, [text, voiceList, options]);

  speechSynthesis.onvoiceschanged = () => {
    setVoiceList(speechSynthesis.getVoices());
  };
  speechSynthesisUtterance.onstart = () => setIsLoading(true);
  speechSynthesisUtterance.onend = () => setIsLoading(false);

  return {
    isLoading,
    setText,
    start: () => speechSynthesis.speak(speechSynthesisUtterance),
    stop: () => {
      speechSynthesis.cancel();
      setIsLoading(false);
    },
  };
};
