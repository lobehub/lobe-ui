import { createCache } from '@ant-design/cssinjs';
import { Button, ConfigProvider, Rate } from 'antd';
import { StyleProvider } from 'antd-style';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { buildAntdStaticCss, createProbeAntdTheme } from './buildAntdStaticCss';
import { buildInlineAntdStyle } from './runtime';

const renderWithCache = (children: Parameters<typeof createElement>[2][]) => {
  const cache = createCache();
  renderToString(
    createElement(StyleProvider, {
      cache,
      children: createElement(
        ConfigProvider,
        { theme: createProbeAntdTheme() },
        createElement('div', null, ...children),
      ),
    }),
  );
  return cache;
};

describe('buildInlineAntdStyle', () => {
  const payload = buildAntdStaticCss({ included: ['button'] });

  it('keeps covered component rules out of the inline css', () => {
    const cache = renderWithCache([createElement(Button, null, '-')]);

    const result = buildInlineAntdStyle(cache, payload);

    expect(result.uncovered).toEqual([]);
    expect(result.css).not.toContain('.ant-btn:hover');
  });

  it('inlines fallback rules for uncovered components and names them', () => {
    const cache = renderWithCache([createElement(Button, null, '-'), createElement(Rate)]);

    const result = buildInlineAntdStyle(cache, payload);

    expect(result.uncovered.length).toBe(1);
    expect(result.css).toContain('.ant-rate');
    expect(result.css).not.toContain('.ant-btn:hover');
    expect(result.html.startsWith('<style data-rc-order="prepend"')).toBe(true);
  });

  it('accepts styleKeys as an array or a set', () => {
    const cache = renderWithCache([createElement(Button, null, '-')]);

    const fromSet = buildInlineAntdStyle(cache, { styleKeys: new Set(payload.styleKeys) });
    const fromArray = buildInlineAntdStyle(cache, { styleKeys: [...payload.styleKeys] });

    expect(fromSet.css).toBe(fromArray.css);
  });
});
