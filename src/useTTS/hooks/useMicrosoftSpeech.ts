import { useState } from 'react';
import useSWR from 'swr';

import { postMicrosoftSpeech } from '../services/postMicrosoftSpeech';
import { SsmlOptions } from '../utils/genSSML';

export const useMicrosoftSpeech = (defaultText: string, options: SsmlOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const { isLoading, data } = useSWR(
    shouldFetch ? [options.name, text].join('-') : null,
    () => postMicrosoftSpeech(text, options),
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
