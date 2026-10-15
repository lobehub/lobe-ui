import type { ColorScaleItem } from '../types';
import { error } from './error';
import { info } from './info';
import { success } from './success';
import { warning } from './warning';

export interface StatusColorScales {
  error: ColorScaleItem;
  info: ColorScaleItem;
  success: ColorScaleItem;
  warning: ColorScaleItem;
}

export const statusColorScales: StatusColorScales = {
  error,
  info,
  success,
  warning,
};
