import qs from 'query-string';

import { type SsmlOptions } from '../utils/genSSML';

export interface MicrosoftSpeechOptions extends SsmlOptions {
  api?: string;
}

export const postMicrosoftSpeech = async (
  text: string,
  { api, ...options }: MicrosoftSpeechOptions,
): Promise<AudioBufferSourceNode> => {
  const response: Response = await fetch(
    qs.stringifyUrl({
      query: { text, ...options },
      url: api || process.env.MICROSOFT_SPEECH_PROXY_URL || '',
    }),
  );

  const audioData = await response.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBufferSource = audioContext.createBufferSource();
  audioBufferSource.buffer = await audioContext.decodeAudioData(audioData);
  audioBufferSource.connect(audioContext.destination);
  return audioBufferSource;
};
