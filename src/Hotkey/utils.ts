export const ALT_KEY = 'alt';
export const MOD_KEY = 'mod';
export const SHIFT_KEY = 'shift';
export const META_KEY = 'meta';
export const BACKSPACE_KEY = 'backspace';
export const CONTROL_KEY = 'ctrl';
export const SPACE_KEY = 'space';
export const TAB_KEY = 'tab';
export const ENTER_KEY = 'enter';
export const LEFT_KEY = 'left';
export const RIGHT_KEY = 'right';
export const UP_KEY = 'up';
export const DOWN_KEY = 'down';
export const RIGHT_CLICK_KEY = 'right-click';
export const LEFT_CLICK_KEY = 'left-click';
export const MID_CLICK_KEY = 'mid-click';

export const splitKeysByPlus = (keys: string): string[] => {
  const placeholder = 'PLACEHOLDER';
  const parts = keys.replaceAll('++', `+${placeholder}`).split('+');
  return parts.filter(Boolean).map((part) => {
    if (part === placeholder) return '+';
    return part;
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
