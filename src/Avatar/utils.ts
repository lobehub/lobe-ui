import { isValidElement, type ReactNode } from 'react';

/**
 * 判断 avatar 是否是默认的 Ant Design Avatar 类型
 * (URL 路径或 React 元素)
 */
export const isDefaultAntAvatar = (avatar: ReactNode): boolean => {
  if (!avatar) return false;

  const isStringAvatar = typeof avatar === 'string';
  const isUrlOrDataUri =
    isStringAvatar && ['/', 'http', 'data:'].some((prefix) => avatar.startsWith(prefix));

  return Boolean(isUrlOrDataUri || isValidElement(avatar));
};

/**
 * 判断是否有有效的背景色
 */
export const hasValidBackground = (background?: string | null): boolean => {
  return Boolean(
    background &&
    background !== 'transparent' &&
    background !== 'rgba(0,0,0,0)' &&
    background !== null,
  );
};

/**
 * 获取用于可读性计算的实际颜色值
 * 如果是 CSS 变量，返回 fallback 值
 */
export const getActualColorForReadable = (
  background: string | undefined,
  fallbackColor: string,
): string => {
  const bgColor = background || fallbackColor;

  // 如果背景是 CSS 变量，使用 fallback 颜色
  if (typeof bgColor === 'string' && bgColor.startsWith('var(')) {
    return fallbackColor;
  }

  return bgColor;
};

/**
 * 格式化头像文本（转大写并可选切片）
 */
export const formatAvatarText = (text: string | undefined, sliceText: boolean): string => {
  if (!text) return '';

  const upperText = text.toUpperCase();
  return sliceText ? upperText.slice(0, 2) : upperText;
};

/**
 * 计算 emoji 大小
 */
export const calculateEmojiSize = (
  size: number,
  hasBackground: boolean,
  emojiScaleWithBackground: boolean,
): number => {
  if (emojiScaleWithBackground) {
    return hasBackground ? size * 0.85 : size;
  }
  return size * 0.85;
};
