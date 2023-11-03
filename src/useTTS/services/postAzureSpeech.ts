import {
  AudioConfig,
  PropertyId,
  ResultReason,
  SpeechConfig,
  SpeechSynthesisOutputFormat,
  SpeechSynthesisResult,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk';

import { type SsmlOptions, genSSML } from '../utils/genSSML';

export interface AzureSpeechOptions extends SsmlOptions {
  api: {
    key: string;
    region: string;
  };
}

// 纯文本生成语音
export const postAzureSpeech = async (
  text: string,
  { api, ...options }: AzureSpeechOptions,
): Promise<AudioBufferSourceNode> => {
  const key = api.key || process.env.AZURE_SPEECH_KEY || '';
  const region = api.key || process.env.AZURE_SPEECH_REGION || '';
  const speechConfig = SpeechConfig.fromSubscription(key, region);
  speechConfig.setProperty(PropertyId.SpeechServiceResponse_RequestSentenceBoundary, 'true');
  speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Webm24Khz16BitMonoOpus;

  const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
  const synthesizer: SpeechSynthesizer | null = new SpeechSynthesizer(speechConfig, audioConfig);

  const completeCb = async (
    result: SpeechSynthesisResult,
    resolve: (value: AudioBufferSourceNode) => void,
  ) => {
    if (result.reason === ResultReason.SynthesizingAudioCompleted) {
      const audioData = result.audioData;
      const audioContext = new AudioContext();
      const audioBufferSource = audioContext.createBufferSource();
      audioBufferSource.buffer = await audioContext.decodeAudioData(audioData);
      audioBufferSource.connect(audioContext.destination);
      resolve(audioBufferSource);
    }
    synthesizer.close();
  };

  const errCb = (err: string, reject: (err?: any) => void) => {
    reject(err);
    synthesizer.close();
  };

  return new Promise<AudioBufferSourceNode>((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      genSSML(text, options),
      (result) => completeCb(result, resolve),
      (err) => errCb(err, reject),
    );
  });
};
