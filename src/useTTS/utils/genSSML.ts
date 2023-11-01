import { Document, ServiceProvider } from 'ssml-document';

type StyleName =
  | 'affectionate'
  | 'angry'
  | 'calm'
  | 'cheerful'
  | 'disgruntled'
  | 'embarrassed'
  | 'fearful'
  | 'general'
  | 'gentle'
  | 'sad'
  | 'serious';

export interface SsmlOptions {
  name: string;
  pitch?: number;
  rate?: number;
  style?: StyleName;
}

export const genSSML = (text: string, options: SsmlOptions) => {
  let ssml = new Document().voice(options.name);
  if (options.style) ssml = ssml.expressAs({ style: options.style });
  if (options.pitch || options.rate)
    ssml = ssml.prosody({ pitch: options.pitch, rate: options.rate });
  const result = ssml.say(text).render({ provider: ServiceProvider.Microsoft });
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts">${result}</speak>`;
};
