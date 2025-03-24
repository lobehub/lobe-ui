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
