import { act, render, screen } from '@testing-library/react';

import { statusColorScales } from '@/color/status';
import type { ColorScaleItem } from '@/color/types';

import { createLobeToken } from './createLobeToken';
import { registerLobeNeutral } from './customNeutral';
import { registerLobePalette } from './customPalette';
import { LobeThemeScript, setLobeTheme, ThemeScope, useTheme } from './scope';
import { getCustomPaletteCss, getPaletteNeutralCss } from './themeCss';

const shade = (hex: string): ColorScaleItem['light'] =>
  Array.from({ length: 13 }, () => hex) as ColorScaleItem['light'];

const scaleOf = (hex: string): ColorScaleItem => ({
  dark: shade(hex),
  darkA: shade(hex),
  light: shade(hex),
  lightA: shade(hex),
});

const Probe = () => {
  const theme = useTheme();
  return <span data-testid="probe">{`${theme.colorError}|${theme.colorWarning}`}</span>;
};

afterEach(() => {
  for (const name of ['data-theme', 'data-palette', 'data-neutral-color'])
    document.documentElement.removeAttribute(name);
  for (const style of document.querySelectorAll('style[id^="lobe-palette-"]')) style.remove();
});

describe('custom status palette', () => {
  it('replaces only the registered statuses in the tokens', () => {
    registerLobePalette('acme', { error: scaleOf('#aa0033') });

    const light = createLobeToken({ appearance: 'light', palette: 'acme' });
    expect(light.colorError).toBe('#aa0033');
    expect(light.colorErrorText).toBe('#aa0033');
    expect(light.colorHighlight).toBe('#aa0033');
    expect(light.colorWarning).toBe(statusColorScales.warning.light[9]);
    expect(createLobeToken({ appearance: 'dark', palette: 'acme' }).colorError).toBe('#aa0033');
  });

  it('falls back to the default palette for an unknown name', () => {
    expect(createLobeToken({ appearance: 'light', palette: 'missing' })).toEqual(
      createLobeToken({ appearance: 'light' }),
    );
    expect(getCustomPaletteCss('missing')).toBe('');
  });

  it('rejects names that cannot be used in a selector', () => {
    expect(() => registerLobePalette("x'] *{", {})).toThrow();
  });

  it('emits light and dark rules for the palette', () => {
    registerLobePalette('acme', { error: scaleOf('#aa0033') });

    const css = getCustomPaletteCss('acme');
    expect(css).toContain(`[data-palette='acme']:not([data-theme='dark'])`);
    expect(css).toContain(`[data-palette='acme'][data-theme='dark']`);
    expect(css).toContain('--lobe-color-error: #aa0033;');
    expect(css).toContain('--lobe-color-error-outline:');
    expect(css).not.toContain('--lobe-color-primary:');
  });

  it('useTheme follows data-palette written by setLobeTheme', async () => {
    registerLobePalette('acme', { error: scaleOf('#aa0033') });
    render(<Probe />);

    await act(async () => setLobeTheme({ palette: 'acme' }));

    expect(document.documentElement.dataset.palette).toBe('acme');
    expect(document.querySelectorAll('style#lobe-palette-acme')).toHaveLength(1);
    expect(screen.getByTestId('probe').textContent).toBe(
      `#aa0033|${statusColorScales.warning.light[9]}`,
    );
  });

  it('picks up a re-registered palette', async () => {
    registerLobePalette('acme', { error: scaleOf('#aa0033') });
    render(<Probe />);
    await act(async () => setLobeTheme({ palette: 'acme' }));

    await act(async () => {
      registerLobePalette('acme', { warning: scaleOf('#ff8800') });
      setLobeTheme({ palette: 'acme' });
    });

    expect(screen.getByTestId('probe').textContent).toBe(
      `${statusColorScales.error.light[9]}|#ff8800`,
    );
    expect(document.querySelector('style#lobe-palette-acme')?.textContent).toContain('#ff8800');
  });

  it('a scope sets the palette for its subtree', () => {
    registerLobePalette('acme', { error: scaleOf('#aa0033') });
    render(
      <ThemeScope palette="acme">
        <Probe />
      </ThemeScope>,
    );

    const probe = screen.getByTestId('probe');
    expect(probe.textContent).toBe(`#aa0033|${statusColorScales.warning.light[9]}`);
    expect(probe.parentElement?.dataset.palette).toBe('acme');
  });

  it('the theme script writes the attribute and the palette stylesheet', () => {
    registerLobePalette('acme', { error: scaleOf('#aa0033') });
    const { container } = render(<LobeThemeScript palette="acme" />);

    const script = container.querySelector('script')?.innerHTML ?? '';
    expect(script).toContain('data-palette');
    expect(script).toContain('lobe-palette-acme');
    expect(script).toContain('--lobe-color-error: #aa0033;');
  });

  it('computes outlines for the neutral + palette combination', () => {
    registerLobePalette('acme', { error: scaleOf('#aa0033') });

    const css = getPaletteNeutralCss('acme', '#0E1010');
    const dark = createLobeToken({ appearance: 'dark', neutralColor: '#0e1010', palette: 'acme' });
    expect(css).toContain(`[data-palette='acme'][data-neutral-color='#0e1010'][data-theme='dark']`);
    expect(css).toContain(`--lobe-color-error-outline: ${dark.colorErrorOutline};`);
    expect(css).toContain(`--lobe-color-warning-outline: ${dark.colorWarningOutline};`);
    expect(getPaletteNeutralCss('missing', '#0e1010')).toBe('');
  });

  it('setLobeTheme injects the combination stylesheet', async () => {
    registerLobePalette('acme', { error: scaleOf('#aa0033') });
    registerLobeNeutral('foundry', scaleOf('#0e1010'));
    await act(async () => setLobeTheme({ neutralColor: 'foundry', palette: 'acme' }));

    expect(document.getElementById('lobe-palette-acme--neutral-name-foundry')).not.toBeNull();
  });
});
