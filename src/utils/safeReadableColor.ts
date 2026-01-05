import { cssVar } from 'antd-style';
import { readableColor } from 'polished';

export const safeReadableColor = (bgColor: string, fallbackColor?: string): string => {
  try {
    return readableColor(bgColor);
  } catch {
    return fallbackColor || cssVar.colorText;
  }
};
