import { flatten } from 'lodash';

import azureVoiceList from '../data/azureVoiceListLite.json';

interface Voice {
  localName?: string;
  name: string;
}
export interface VoiceList {
  [locale: string]: Voice[];
}

export const genSpeechSynthesVoiceList = (): VoiceList => {
  const data = speechSynthesis.getVoices();
  const list: VoiceList = {};
  for (const voice of data) {
    if (!list[voice.lang]) list[voice.lang] = [];
    list[voice.lang].push({ localName: voice.name, name: voice.voiceURI });
  }
  return list;
};

export const getSpeechSynthesVoiceList = (locale?: string): Voice[] => {
  const speechSynthesVoiceList = genSpeechSynthesVoiceList();
  if (locale) return speechSynthesVoiceList?.[locale] || [];
  return flatten(Object.values(speechSynthesVoiceList));
};

export const getAzureVoiceList = (locale?: string): Voice[] => {
  if (locale) return (azureVoiceList as VoiceList)[locale] || [];
  return flatten(Object.values(azureVoiceList));
};
