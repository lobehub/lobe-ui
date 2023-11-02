import { stringifyUrl } from 'query-string';
import { v4 as uuidv4 } from 'uuid';

import { type SsmlOptions, genSSML } from '../utils/genSSML';

const TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';

const getHeadersAndData = (data: string) => {
  const headers: { [key: string]: string } = {};
  for (const line of data.slice(0, data.indexOf('\r\n\r\n')).split('\r\n')) {
    const [key, value] = line.split(':', 2);
    headers[key] = value;
  }
  return { data: data.slice(data.indexOf('\r\n\r\n') + 4), headers };
};

const genSendContent = (header: { [key: string]: string }, data: string) => {
  const content = [];
  for (const [key, value] of Object.entries(header)) {
    content.push(`${key}:${value}`);
  }
  content.push('', data);
  return content.join('\r\n');
};

export const postEdgeSpeech = async (
  text: string,
  options: SsmlOptions,
  {
    setData,
    setShouldFetch,
    setIsPlaying,
  }: {
    setData?: (data: AudioBufferSourceNode) => void;
    setIsPlaying: (value: boolean) => void;
    setShouldFetch: (value: boolean) => void;
  },
) => {
  const connectId = uuidv4().replaceAll('-', '');
  const date = new Date().toString();
  const audioContext = new AudioContext();
  const audioBufferSource = audioContext.createBufferSource();

  const ws = new WebSocket(
    stringifyUrl({
      query: {
        ConnectionId: connectId,
        TrustedClientToken: TOKEN,
      },
      url: 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1',
    }),
  );
  ws.binaryType = 'arraybuffer';
  ws.addEventListener('open', () => {
    ws.send(
      genSendContent(
        {
          'Content-Type': 'application/json; charset=utf-8',
          'Path': 'speech.config',
          'X-Timestamp': date,
        },
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: { sentenceBoundaryEnabled: false, wordBoundaryEnabled: true },
                outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
              },
            },
          },
        }),
      ),
    );
    ws.send(
      genSendContent(
        {
          'Content-Type': 'application/ssml+xml',
          'Path': 'ssml',
          'X-RequestId': connectId,
          'X-Timestamp': date,
        },
        genSSML(text, options),
      ),
    );
  });

  let audioData = new ArrayBuffer(0);
  let downloadAudio = false;

  ws.addEventListener('message', async (event) => {
    if (typeof event.data === 'string') {
      const { headers } = getHeadersAndData(event.data);
      const path = headers['Path'];
      switch (path) {
        case 'turn.start': {
          downloadAudio = true;
          break;
        }
        case 'turn.end': {
          downloadAudio = false;
          if (!audioData.byteLength) return;
          const buffer = await audioContext.decodeAudioData(audioData);
          audioBufferSource.buffer = buffer;
          audioBufferSource.connect(audioContext.destination);
          setData?.(audioBufferSource);
          audioBufferSource.start();
          audioBufferSource.addEventListener('ended', () => {
            setShouldFetch(false);
            setIsPlaying(false);
            audioContext.close();
          });
          break;
        }
      }
    } else if (event.data instanceof ArrayBuffer) {
      if (!downloadAudio) return;

      const dataview = new DataView(event.data);
      const headerLength = dataview.getInt16(0);
      if (event.data.byteLength > headerLength + 2) {
        const newBody = event.data.slice(2 + headerLength);
        const newAudioData = new ArrayBuffer(audioData.byteLength + newBody.byteLength);
        const mergedUint8Array = new Uint8Array(newAudioData);
        mergedUint8Array.set(new Uint8Array(audioData), 0);
        mergedUint8Array.set(new Uint8Array(newBody), audioData.byteLength);
        audioData = newAudioData;
      }
    }
  });

  return audioData;
};
