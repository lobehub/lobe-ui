/**
 * Walk `content` and return the language of the last *unclosed* fenced
 * code block, or `null` if every fence is closed (or there are none).
 *
 * Used by the smoother to decide whether to bypass its buffer for the
 * current input. CommonMark recognises an opening fence as a line whose
 * first non-space chars are 3+ backticks; we deliberately stay simple:
 * 3 literal backticks at line start, language word after. That covers
 * the markdown LLMs actually emit; tildes and indented fences fall back
 * to normal smoothing rather than getting clever.
 *
 * Linear scan over the input, ~10ns per char on V8. Called on every
 * smoothing tick during streaming so the simplicity matters.
 */
export const findOpenFenceLanguage = (content: string): string | null => {
  let inFence = false;
  let lang = '';
  let i = 0;
  const len = content.length;
  while (i < len) {
    const nl = content.indexOf('\n', i);
    const lineEnd = nl === -1 ? len : nl;
    const line = content.slice(i, lineEnd);
    if (line.startsWith('```')) {
      if (inFence) {
        inFence = false;
        lang = '';
      } else {
        inFence = true;
        lang = line.slice(3).trim().toLowerCase();
      }
    }
    if (nl === -1) break;
    i = nl + 1;
  }
  return inFence ? lang : null;
};
