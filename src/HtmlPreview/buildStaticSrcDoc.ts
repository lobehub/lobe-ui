import { buildAutoHeightScript } from './injectAutoHeightScript';
import { STORAGE_SHIM_SCRIPT } from './injectStorageShim';

interface BuildStaticSrcDocOptions {
  background?: string;
  content: string;
  frameId: string;
}

const shimsBlock = (frameId: string) =>
  `<script>${STORAGE_SHIM_SCRIPT}</script><script>${buildAutoHeightScript(frameId)}</script>`;

const baseStyle = (background?: string) =>
  `<style>html,body{margin:0;padding:0;${background ? `background:${background};` : ''}color-scheme:light dark;}</style>`;

/**
 * Wrap a user's HTML document with our shims so the iframe can load it as
 * a single self-contained srcDoc. This path is used when the content is
 * *static* (not streaming) — the browser parses it via the normal HTML
 * pipeline, so external `<script src=…>` tags load and execute exactly
 * like they would on a regular page. Tailwind CDN, Chart.js, p5.js — all
 * the things a Play CDN expects to see at parse time — work naturally.
 *
 * For *streaming* content we instead use `buildShellSrcDoc` + postMessage
 * morph, which trades reliable script execution for the ability to fade
 * in new nodes without reloading the iframe.
 *
 * Strategy: inject our shims (storage shim, auto-height) as early in the
 * resulting `<head>` as possible so they run before any user script. If
 * the user supplied a `<head>` open tag we slot the shims in right after
 * it; otherwise we wrap a minimal document around fragments.
 */
export const buildStaticSrcDoc = ({
  background,
  content,
  frameId,
}: BuildStaticSrcDocOptions): string => {
  const head = `${baseStyle(background)}${shimsBlock(frameId)}`;
  const lower = content.toLowerCase();
  const hasHtmlTag = lower.includes('<html');

  if (!hasHtmlTag) {
    return `<!DOCTYPE html><html><head><meta charset="utf-8">${head}</head><body>${content}</body></html>`;
  }

  const headOpenMatch = content.match(/<head\b[^>]*>/i);
  if (headOpenMatch) {
    const idx = headOpenMatch.index! + headOpenMatch[0].length;
    return content.slice(0, idx) + head + content.slice(idx);
  }

  const headCloseIdx = lower.indexOf('</head>');
  if (headCloseIdx !== -1) {
    return content.slice(0, headCloseIdx) + head + content.slice(headCloseIdx);
  }

  const htmlOpenMatch = content.match(/<html\b[^>]*>/i);
  if (htmlOpenMatch) {
    const idx = htmlOpenMatch.index! + htmlOpenMatch[0].length;
    return content.slice(0, idx) + `<head>${head}</head>` + content.slice(idx);
  }

  return `<!DOCTYPE html><html><head>${head}</head><body>${content}</body></html>`;
};
