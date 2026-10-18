import { mermaidThemes } from './const';
import { getMermaidThemeVars, MERMAID_PRESETS } from './themes';

describe('getMermaidThemeVars', () => {
  it('points the default theme at lobe tokens so it follows light and dark without re-rendering', () => {
    expect(getMermaidThemeVars()).toMatchObject({
      '--pele-accent': 'var(--lobe-color-primary)',
      '--pele-bg': 'var(--lobe-color-bg-container)',
      '--pele-fg': 'var(--lobe-color-text)',
    });
    expect(getMermaidThemeVars('lobe-theme')).toBe(getMermaidThemeVars());
  });

  it('maps a preset palette and derives the colors it leaves out', () => {
    const vars = getMermaidThemeVars('zinc-dark') as Record<string, string>;

    expect(vars['--pele-bg']).toBe(MERMAID_PRESETS['zinc-dark'].bg);
    expect(vars['--pele-fg']).toBe(MERMAID_PRESETS['zinc-dark'].fg);
    expect(vars['--pele-surface']).toContain('color-mix');
  });

  it('falls back to the default theme for unknown names', () => {
    expect(getMermaidThemeVars('toString')).toBe(getMermaidThemeVars());
  });

  it('keeps every theme id that settings may have persisted', () => {
    expect(mermaidThemes.map((item) => item.id)).toEqual([
      'lobe-theme',
      'zinc-light',
      'zinc-dark',
      'tokyo-night',
      'tokyo-night-storm',
      'tokyo-night-light',
      'catppuccin-mocha',
      'catppuccin-latte',
      'nord',
      'nord-light',
      'dracula',
      'github-light',
      'github-dark',
      'solarized-light',
      'solarized-dark',
      'one-dark',
    ]);
  });
});
