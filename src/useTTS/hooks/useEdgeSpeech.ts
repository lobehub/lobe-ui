import { useCallback, useState } from 'react';
import useSWR from 'swr';

import { postEdgeSpeech } from '../services/postEdgeSpeech';
import { SsmlOptions } from '../utils/genSSML';

export const useEdgeSpeech = (defaultText: string, options: SsmlOptions) => {
  const [data, setData] = useState<AudioBufferSourceNode>();
  const [text, setText] = useState<string>(defaultText);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { isLoading } = useSWR(
    shouldFetch ? [options.name, text].join('-') : null,
    () => postEdgeSpeech(text, options, { setData, setIsPlaying, setShouldFetch }),
    {
      onError: () => setShouldFetch(false),
      onSuccess: () => setShouldFetch(false),
    },
  );

  const start = useCallback(() => {
    setShouldFetch(true);
    setIsPlaying(true);
  }, [data]);

  const stop = useCallback(() => {
    setShouldFetch(false);
    setIsPlaying(false);
    data?.stop();
  }, [data]);

  return {
    data,
    isLoading: isLoading || isPlaying,
    setText,
    start,
    stop,
  };
};
