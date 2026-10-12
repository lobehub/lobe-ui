import type { File } from '@babel/types';
import MagicString from 'magic-string';

import { parse } from './ast';

export interface TransformContext {
  ast: File;
  code: string;
  ms: MagicString;
}

export type Transform = (ctx: TransformContext) => void;

export const applyTransforms = (code: string, filename: string, transforms: Transform[]) => {
  let current = code;
  for (const transform of transforms) {
    const ms = new MagicString(current);
    transform({ ast: parse(current, filename), code: current, ms });
    if (ms.hasChanged()) current = ms.toString();
  }
  return { changed: current !== code, code: current };
};
