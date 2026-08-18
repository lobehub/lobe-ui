import { createHash } from 'node:crypto';

export const hashCss = (css: string): string =>
  createHash('sha256').update(css).digest('hex').slice(0, 8);
