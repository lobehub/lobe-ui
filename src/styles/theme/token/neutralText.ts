export type NeutralTextLadder = Record<'dark' | 'light', [string, string, string, string]>;

export const neutralText: Record<string, NeutralTextLadder> = {
  gray: {
    dark: ['#e6e6e6', '#b4b4b4', '#8f8f8f', '#6b6b6b'],
    light: ['#1f1f1f', '#666666', '#8a8a8a', '#b0b0b0'],
  },
  mauve: {
    dark: ['#e9e5ec', '#b6b3b9', '#908e94', '#6c6a70'],
    light: ['#1f1f23', '#67656b', '#8b898f', '#b1afb5'],
  },
  olive: {
    dark: ['#e5e7e1', '#b2b5af', '#8d908b', '#696c67'],
    light: ['#1d201c', '#646762', '#888b85', '#aeb1aa'],
  },
  sage: {
    dark: ['#e3e7e4', '#b0b5b3', '#8b908e', '#676c6a'],
    light: ['#1b201e', '#616765', '#868c89', '#abb1ae'],
  },
  sand: {
    dark: ['#e9e6dc', '#b6b4ab', '#918f87', '#6c6b63'],
    light: ['#1f201a', '#67665f', '#8b8a82', '#b2b0a8'],
  },
  slate: {
    dark: ['#e5e6ea', '#b3b4b8', '#8d8f93', '#696b6f'],
    light: ['#1d1f22', '#646669', '#888a8d', '#aeb0b3'],
  },
};
