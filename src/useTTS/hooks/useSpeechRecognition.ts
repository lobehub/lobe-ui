import { useEffect, useState } from 'react';

const SpeechRecognition =
  (globalThis as any)?.SpeechRecognition || (window as any)?.webkitSpeechRecognition;

export const useSpeechRecognition = (locale: string) => {
  const [recognition, setRecognition] = useState<any>(null);
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [finalStop, setFinalStop] = useState<boolean>(false);

  useEffect(() => {
    if (recognition) return;
    try {
      const speechRecognition = new SpeechRecognition();

      speechRecognition.interimResults = true;
      speechRecognition.continuous = true;
      speechRecognition.onstart = () => {
        setFinalStop(false);
        setIsLoading(true);
      };
      speechRecognition.onend = () => {
        setIsLoading(false);
        setFinalStop(true);
      };
      speechRecognition.onresult = ({ results }: any) => {
        if (!results) return;
        const result = results[0];
        if (!finalStop && result?.[0]?.transcript) setText(result[0].transcript);
        if (result.isFinal) {
          speechRecognition.abort();
          setIsLoading(false);
        }
      };
      setRecognition(speechRecognition);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (recognition) recognition.lang = locale;
  }, [locale, recognition]);

  const handleStop = () => {
    try {
      recognition.abort();
    } catch {}
    setIsLoading(false);
  };

  return {
    isLoading,
    start: () => {
      try {
        setText('');
        recognition.start();
      } catch {}
    },
    stop: () => handleStop(),
    text,
  };
};
