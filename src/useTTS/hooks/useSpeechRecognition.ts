import { useState } from 'react';

const SpeechRecognition =
  (globalThis as any)?.SpeechRecognition || (window as any)?.webkitSpeechRecognition;

export const useSpeechRecognition = (locale: string) => {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [finalStop, setFinalStop] = useState<boolean>(false);
  const recognition = new SpeechRecognition();
  recognition.lang = locale;
  recognition.interimResults = true;
  recognition.continuous = true;

  const handleStop = () => {
    recognition.abort();
    setIsLoading(false);
  };

  recognition.onstart = () => {
    setFinalStop(false);
    setIsLoading(true);
    setText('');
  };
  recognition.onend = () => {
    setIsLoading(false);
    setFinalStop(true);
  };

  recognition.onresult = ({ results }: any) => {
    if (!results) return;
    const result = results[0];
    if (!finalStop && result?.[0]?.transcript) setText(result[0].transcript);
    if (result.isFinal) handleStop();
  };

  return {
    isLoading,
    start: () => recognition.start(),
    stop: () => handleStop(),
    text,
  };
};
