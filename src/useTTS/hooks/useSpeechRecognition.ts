import { useState } from 'react';

const SpeechRecognition =
  (globalThis as any)?.SpeechRecognition || (window as any)?.webkitSpeechRecognition;

export const useSpeechRecognition = (locale: string) => {
  const [text, setText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [finalStop, setFinalStop] = useState<boolean>(false);
  const recognition = new SpeechRecognition();
  recognition.lang = locale;
  recognition.interimResults = true;
  recognition.continuous = true;

  const handleStop = () => {
    recognition.abort();
    setIsProcessing(false);
  };

  recognition.onstart = () => {
    setFinalStop(false);
    setIsProcessing(true);
    setText('');
  };
  recognition.onend = () => {
    setIsProcessing(false);
    setFinalStop(true);
  };

  recognition.onresult = ({ results }: any) => {
    if (!results) return;
    const result = results[0];
    if (!finalStop && result?.[0]?.transcript) setText(result[0].transcript);
    if (result.isFinal) handleStop();
  };

  return {
    isProcessing,
    start: () => recognition.start(),
    stop: () => handleStop(),
    text,
  };
};
