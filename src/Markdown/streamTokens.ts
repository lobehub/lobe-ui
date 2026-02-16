const WHITESPACE_RE = /\s/;
const WHITESPACE_ONLY_RE = /^\s+$/;
const CJK_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;

export const isWhitespaceToken = (token: string) => WHITESPACE_ONLY_RE.test(token);

export const splitStreamAnimationTokens = (text: string): string[] => {
  const coarseParts: string[] = [];
  let current = '';
  let inWhitespace = false;

  for (const char of text) {
    const isWhitespace = WHITESPACE_RE.test(char);
    if (isWhitespace !== inWhitespace && current) {
      coarseParts.push(current);
      current = '';
    }

    current += char;
    inWhitespace = isWhitespace;
  }

  if (current) {
    coarseParts.push(current);
  }

  const parts: string[] = [];
  for (const part of coarseParts) {
    if (isWhitespaceToken(part) || !CJK_RE.test(part)) {
      parts.push(part);
      continue;
    }

    parts.push(...Array.from(part));
  }

  return parts;
};

export const countStreamAnimationTokens = (text: string) =>
  splitStreamAnimationTokens(text).reduce((count, token) => {
    if (isWhitespaceToken(token)) return count;
    return count + 1;
  }, 0);
