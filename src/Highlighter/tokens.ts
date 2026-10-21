import type { ThemedToken, TokensResult } from '@pierre/highlights';
import type { CSSProperties } from 'react';

const FONT_ITALIC = 1;
const FONT_BOLD = 2;
const FONT_UNDERLINE = 4;

export const escapeHtml = (str: string): string =>
  str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const tokenStyleEntries = (token: ThemedToken): [string, string][] => {
  if (token.htmlStyle) return Object.entries(token.htmlStyle);

  const entries: [string, string][] = [];
  if (token.color) entries.push(['color', token.color]);
  if (token.bgColor) entries.push(['background-color', token.bgColor]);
  const fontStyle = token.fontStyle ?? 0;
  if (fontStyle & FONT_ITALIC) entries.push(['font-style', 'italic']);
  if (fontStyle & FONT_BOLD) entries.push(['font-weight', 'bold']);
  if (fontStyle & FONT_UNDERLINE) entries.push(['text-decoration', 'underline']);
  return entries;
};

const styleCache = new WeakMap<ThemedToken, CSSProperties>();

export const getTokenStyle = (token: ThemedToken): CSSProperties => {
  const cached = styleCache.get(token);
  if (cached) return cached;

  const style: Record<string, string> = { whiteSpace: 'pre' };
  for (const [key, value] of tokenStyleEntries(token)) {
    style[key.startsWith('--') ? key : key.replaceAll(/-([a-z])/g, (_, c) => c.toUpperCase())] =
      value;
  }
  styleCache.set(token, style as CSSProperties);
  return style as CSSProperties;
};

export const getPreStyle = ({ bg, fg }: Pick<TokensResult, 'bg' | 'fg'>) => {
  if (!bg && !fg) return;
  return { backgroundColor: bg, color: fg } satisfies CSSProperties;
};

export const tokensToHtml = (result: TokensResult, themeName: string): string => {
  const preStyle = [result.bg && `background-color:${result.bg}`, result.fg && `color:${result.fg}`]
    .filter(Boolean)
    .join(';');

  let html = `<pre class="shiki ${escapeHtml(themeName)}" style="${preStyle}" tabindex="0"><code>`;
  for (const [index, line] of result.tokens.entries()) {
    if (index > 0) html += '\n';
    html += '<span class="line">';
    for (const token of line) {
      const style = tokenStyleEntries(token)
        .map(([key, value]) => `${key}:${value}`)
        .join(';');
      html += style
        ? `<span style="${style}">${escapeHtml(token.content)}</span>`
        : `<span>${escapeHtml(token.content)}</span>`;
    }
    html += '</span>';
  }
  return `${html}</code></pre>`;
};
