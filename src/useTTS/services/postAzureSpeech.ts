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

export interface AzureSpeechEnv {
  SPEECH_KEY: string;
  SPEECH_REGION: string;
}

// 纯文本生成语音
export const postAzureSpeech = async (
  text: string,
  options: SsmlOptions,
  env: AzureSpeechEnv,
): Promise<Buffer> => {
  const speechConfig = SpeechConfig.fromSubscription(env.SPEECH_KEY, env.SPEECH_REGION);
  speechConfig.setProperty(PropertyId.SpeechServiceResponse_RequestSentenceBoundary, 'true');
  speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Webm24Khz16BitMonoOpus;

  const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
  const synthesizer: SpeechSynthesizer | null = new SpeechSynthesizer(speechConfig, audioConfig);

  const completeCb = (
    result: SpeechSynthesisResult,
    resolve: (value: Buffer) => void,
    reject: (err?: any) => void,
  ) => {
    if (result.reason === ResultReason.SynthesizingAudioCompleted) {
      resolve(Buffer.from(result.audioData));
    } else {
      reject(result);
    }
    synthesizer.close();
  };

  const errCb = (err: string, reject: (err?: any) => void) => {
    reject(err);
    synthesizer.close();
  };

  return new Promise<Buffer>((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      genSSML(text, options),
      (result) => completeCb(result, resolve, reject),
      (err) => errCb(err, reject),
    );
  });
};
