import { KeyMapEnum } from './type';

export const splitKeysByPlus = (keys: string): string[] => {
  return keys.replaceAll('++', `+${KeyMapEnum.Equal}`).split('+');
};

export const startCase = (str: string): string => {
  return str
    .replaceAll(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

export const checkIsAppleDevice = (isApple?: boolean) => {
  if (isApple !== undefined) {
    return isApple;
  }

  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false; // 处理 SSR 环境
  }

  const userAgent = navigator.userAgent.toLowerCase();
  return /mac|iphone|ipod|ipad|ios/i.test(userAgent);
};

export const combineKeys = (keys: string[]): string => keys.join('+');
