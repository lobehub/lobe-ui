import { createHash } from 'node:crypto';

export const getHash = (string_: string, length = 8) =>
  createHash('md5').update(string_).digest('hex').slice(0, length);
