import { extractStyle as extractCssinjsStyle } from '@ant-design/cssinjs';

import { styleKeysOf } from '../shared';

interface CssinjsCache {
  cache: Map<string, unknown>;
  extracted: Set<string>;
  updateTimes: Map<string, number>;
}

export interface InlineAntdStyleResult {
  css: string;
  /** css wrapped in a prepend-ordered style tag, '' when empty */
  html: string;
  /** probe-uncovered components whose rules fell back inline */
  uncovered: string[];
}

// Replaces antd-style's inline antd entry: component css-var blocks always stay
// inline (their values are the light-theme truth for this render), while style
// rules ship via the static stylesheet — except components the probe set missed,
// which fall back to inline rules.
export const buildInlineAntdStyle = (
  runtimeCache: unknown,
  payload: { styleKeys: Iterable<string> },
): InlineAntdStyleResult => {
  const staticKeys =
    payload.styleKeys instanceof Set ? payload.styleKeys : new Set(payload.styleKeys);
  const cssinjsCache = runtimeCache as CssinjsCache;

  const cssVarCss = extractCssinjsStyle(cssinjsCache as never, {
    plain: true,
    types: ['cssVar'],
  });

  const uncoveredKeys = styleKeysOf(cssinjsCache).filter((key) => !staticKeys.has(key));
  let uncoveredCss = '';
  if (uncoveredKeys.length > 0) {
    const pseudoCache = {
      cache: new Map(uncoveredKeys.map((key) => [key, cssinjsCache.cache.get(key)])),
      extracted: new Set<string>(),
      updateTimes: cssinjsCache.updateTimes,
    };
    uncoveredCss = extractCssinjsStyle(pseudoCache as never, { plain: true, types: ['style'] });
  }

  const css = cssVarCss + uncoveredCss;

  return {
    css,
    html: css ? `<style data-rc-order="prepend" data-rc-priority="-9999">${css}</style>` : '',
    uncovered: uncoveredKeys.map((key) => key.split('%')[2] ?? key),
  };
};
