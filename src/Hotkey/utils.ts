import { KeyMapEnum } from './const';

// https://superuser.com/questions/1238058/key-combination-order
export const NORMATIVE_MODIFIER = [
  // win: Ctrl ,mac: Control
  KeyMapEnum.Ctrl,
  KeyMapEnum.Control,

  //  win: Win ,mac: Command
  KeyMapEnum.Meta,

  // Mod should have same priority as Ctrl since it represents Ctrl on Windows
  KeyMapEnum.Mod,

  // win: Alt ,mac: Option
  KeyMapEnum.Alt,

  // win: Shift ,mac: Shift
  KeyMapEnum.Shift,
];

const orderMap = Object.fromEntries(NORMATIVE_MODIFIER.map((key, index) => [key, index]));

export const splitKeysByPlus = (keys: string): string[] => {
  return keys
    .replaceAll('++', `+${KeyMapEnum.Equal}`)
    .split('+')
    .sort((x, y) => {
      const idxX = orderMap[x.toLowerCase()] ?? orderMap.length;
      const idxY = orderMap[y.toLowerCase()] ?? orderMap.length;

      return idxX - idxY;
    });
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
