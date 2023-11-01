import { useState } from 'react';
import useSWR from 'swr';

import { AzureSpeechEnv, postAzureSpeech } from '../services/postAzureSpeech';
import { SsmlOptions } from '../utils/genSSML';

export const useAzureSpeech = (defaultText: string, options: SsmlOptions, env: AzureSpeechEnv) => {
  const [text, setText] = useState<string>(defaultText);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const { isLoading, data } = useSWR(
    shouldFetch ? [options.name, text].join('-') : null,
    () => postAzureSpeech(text, options, env),
    {
      onError: (error) => {
        setShouldFetch(false);
        console.error(error);
      },
      onSuccess: (data) => {
        setShouldFetch(false);
        console.log(data);
      },
    },
  );

  return {
    data,
    isLoading,
    setText,
    start: () => {
      setShouldFetch(true);
    },
    stop: () => {
      setShouldFetch(false);
    },
  };
};
