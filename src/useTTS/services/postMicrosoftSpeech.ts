import { v4 as uuidv4 } from 'uuid';

import { type SsmlOptions, genSSML } from '../utils/genSSML';

export const postMicrosoftSpeech = async (
  text: string,
  options: SsmlOptions,
): Promise<ArrayBuffer> => {
  const data = JSON.stringify({
    offsetInPlainText: 0,
    properties: {
      SpeakTriggerSource: 'AccTuningPagePlayButton',
    },
    ssml: genSSML(text, options),
    ttsAudioFormat: 'audio-24khz-160kbitrate-mono-mp3',
  });

  const DEFAULT_HEADERS = {
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'authority': 'southeastasia.api.speech.microsoft.com',
    'content-type': 'application/json',
    'customvoiceconnectionid': uuidv4(),
    'origin': 'https://speech.microsoft.com',
    'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'no-cors',
    'sec-fetch-site': 'same-site',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
  };

  try {
    const response: Response = await fetch(
      'https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak',
      {
        body: data,
        headers: DEFAULT_HEADERS,
        method: 'POST',
        mode: 'no-cors',
        // @ts-ignore
        responseType: 'arraybuffer',
      },
    );
    return await response.arrayBuffer();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
