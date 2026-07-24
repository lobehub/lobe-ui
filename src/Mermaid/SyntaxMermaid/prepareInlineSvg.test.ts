import { renderMermaidSVG } from 'beautiful-mermaid';
import { describe, expect, it } from 'vitest';

import { prepareInlineMermaidSvg, toStandaloneSvgString } from './prepareInlineSvg';

const render = () =>
  renderMermaidSVG('flowchart LR\n  A[Start] --> B{Go}', {
    bg: 'var(--ant-color-bg-container)',
    fg: 'var(--ant-color-text)',
  });

describe('prepareInlineMermaidSvg', () => {
  it('drops the Google Fonts @import that inline rendering would actually request', () => {
    const raw = render();
    expect(raw).toContain('fonts.googleapis.com');

    const inline = prepareInlineMermaidSvg(raw, 'scope-1');
    expect(inline).not.toContain('fonts.googleapis.com');
    expect(inline).not.toContain('@import');
  });

  it('scopes every generated rule so the style block cannot leak to the page', () => {
    const inline = prepareInlineMermaidSvg(render(), 'scope-1');
    const css = /<style>([\S\s]*?)<\/style>/.exec(inline)?.[1] ?? '';

    const selectors = [...css.matchAll(/(^|})([^{}@]+)\{/g)].map((match) => match[2]!.trim());

    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors) {
      expect(selector.startsWith('#scope-1')).toBe(true);
    }
  });

  it('maps the root svg selector onto the scope itself, not a descendant', () => {
    const inline = prepareInlineMermaidSvg(render(), 'scope-1');

    expect(inline).toContain('#scope-1 {');
    expect(inline).not.toContain('#scope-1 svg {');
  });

  it('removes the bare text rule so page CSS can supply the theme font', () => {
    const inline = prepareInlineMermaidSvg(render(), 'scope-1');
    const css = /<style>([\S\s]*?)<\/style>/.exec(inline)?.[1] ?? '';

    expect(css).not.toMatch(/#scope-1 text\s*\{/);
  });

  it('tags the root svg with the scope id and keeps the diagram body', () => {
    const inline = prepareInlineMermaidSvg(render(), 'scope-1');

    expect(inline).toContain('<svg id="scope-1"');
    expect(inline).toContain('viewBox');
  });

  it('passes empty input through untouched', () => {
    expect(prepareInlineMermaidSvg('', 'scope-1')).toBe('');
  });
});

describe('toStandaloneSvgString', () => {
  it('bakes root custom properties into the serialized copy', () => {
    const host = document.createElement('div');
    host.innerHTML = prepareInlineMermaidSvg(render(), 'scope-1');
    document.body.append(host);

    const svg = host.querySelector('svg')!;
    svg.style.setProperty('--bg', '#0d0d0d');
    svg.style.setProperty('--fg', '#ffffff');

    const standalone = toStandaloneSvgString(svg);
    host.remove();

    expect(standalone).toContain('--bg: #0d0d0d');
    expect(standalone).toContain('--fg: #ffffff');
  });
});
