export const isMacLike =
  typeof window !== 'undefined' &&
  'navigator' in window &&
  /(mac|iphone|ipod|ipad)/i.test(navigator.platform);
