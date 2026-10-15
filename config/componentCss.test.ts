// @vitest-environment node
import { layerComponentCss } from './componentCss';

const layers = (css: string) => [...css.matchAll(/@layer [^{;]+[{;]/g)].map(([match]) => match);

describe('layerComponentCss', () => {
  it('keeps a comment-leading file that is already layered as is', () => {
    const css = layerComponentCss(
      '/* why */\n@layer lobe-ui {\n  .lobe-a { color: var(--x); }\n}',
      'a.css',
    );

    expect(layers(css)).toEqual(['@layer lobe-ui {']);
    expect(css).toContain('color: var(--x)');
  });

  it('wraps an unlayered file in lobe-ui with the StyleX lightningcss targets', () => {
    const css = layerComponentCss(
      '/* why */\n.lobe-a:dir(rtl) { padding-inline: 2px; user-select: none; }',
      'a.css',
    );

    expect(layers(css)).toEqual(['@layer lobe-ui {']);
    expect(css).toMatch(/@layer lobe-ui \{\s+\.lobe-a:dir\(rtl\)/);
    expect(css).toContain('padding-inline: 2px');
    expect(css).toContain('-webkit-user-select: none');
  });

  it('wraps only the unlayered runs of a mixed file and keeps their order', () => {
    const css = layerComponentCss(
      `.lobe-a { color: red; }
@layer lobe-ui { .lobe-b { color: blue; } }
@keyframes lobe-spin { to { transform: rotate(1turn); } }
@layer lobe-ui.inner { .lobe-c { color: green; } }`,
      'a.css',
    );

    expect(layers(css)).toEqual(['@layer lobe-ui {', '@layer lobe-ui.inner {']);
    expect(css.indexOf('.lobe-a')).toBeLessThan(css.indexOf('.lobe-b'));
    expect(css.indexOf('.lobe-b')).toBeLessThan(css.indexOf('@keyframes lobe-spin'));
    expect(css).not.toContain('lobe-ui.lobe-ui');
  });
});
