import { flatten } from 'lodash-es';

import azureVoiceList from '../data/azureVoiceListLite.json';
import edgeVoiceList from '../data/edgeVoiceList.json';
import speechSynthesVoiceListFallback from '../data/speechSynthesVoiceList.json';

interface Voice {
  localeName?: string;
  name: string;
}

interface VoiceOptions {
  [key: string]: string;
}
export interface VoiceList {
  [locale: string]: Voice[];
}

export interface VoiceListLite {
  [locale: string]: string[];
}

export const genSpeechSynthesVoiceList = (): VoiceListLite => {
  const data = speechSynthesis.getVoices();
  const list: VoiceListLite = {};
  for (const voice of data) {
    if (!list[voice.lang]) list[voice.lang] = [];
    list[voice.lang].push(voice.name);
  }

  return Object.keys(list).length > 0 ? list : speechSynthesVoiceListFallback;
};

export const getSpeechSynthesVoiceList = (locale?: string): string[] => {
  const speechSynthesVoiceList = genSpeechSynthesVoiceList();
  let data: string[] = [];
  data =
    locale && speechSynthesVoiceList?.[locale]
      ? speechSynthesVoiceList?.[locale] || []
      : flatten(Object.values(speechSynthesVoiceList));

  return data;
};

export const getAzureVoiceList = (locale?: string): VoiceOptions => {
  const options: VoiceOptions = {};
  let data: Voice[] = [];
  data =
    locale && (azureVoiceList as VoiceList)[locale]
      ? (azureVoiceList as VoiceList)[locale] || []
      : flatten(Object.values(azureVoiceList));
  data.forEach((voice: any) => {
    options[voice.localeName || voice.name] = voice.name;
  });

  return options;
};

export const getEdgeVoiceList = (locale?: string): VoiceOptions => {
  const options: VoiceOptions = {};
  const list = flatten(Object.values(edgeVoiceList));
  let data: Voice[] = [];
  data =
    locale && (azureVoiceList as VoiceList)[locale]
      ? (azureVoiceList as VoiceList)[locale] || []
      : flatten(Object.values(azureVoiceList));
  data.forEach((voice: any) => {
    if (!list.includes(voice.name)) return;
    options[voice.localeName || voice.name] = voice.name;
  });

  return options;
};
