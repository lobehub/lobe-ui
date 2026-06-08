import { cssVar } from 'antd-style';
import { readableColor } from 'polished';

export const safeReadableColor = (bgColor: string, fallbackColor?: string): string => {
  try {
    return readableColor(bgColor);
  } catch {
    if (bgColor.startsWith('var(')) return `contrast-color(${bgColor})`;
    return fallbackColor || cssVar.colorText;
  }
};
