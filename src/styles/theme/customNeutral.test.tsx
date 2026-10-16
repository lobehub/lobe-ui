import { act, render, screen } from '@testing-library/react';

import { gray } from '@/color/colors';
import type { ColorScaleItem } from '@/color/types';

import { createLobeToken } from './createLobeToken';
import { generateNeutralScale, registerLobeNeutral } from './customNeutral';
import { setLobeTheme, ThemeScope, useTheme } from './scope';
import { getCustomNeutralCss } from './themeCss';

const withDarkBg = (bg: string): ColorScaleItem => {
  const dark = [...gray.dark] as ColorScaleItem['dark'];
  dark[1] = bg;
  return { ...gray, dark };
};

const Probe = () => {
  const theme = useTheme();
  return <span data-testid="probe">{theme.colorBgContainer}</span>;
};

afterEach(() => {
  for (const name of ['data-theme', 'data-neutral-color'])
    document.documentElement.removeAttribute(name);
  for (const style of document.querySelectorAll('style[id^="lobe-neutral-"]')) style.remove();
});

describe('custom neutral colour', () => {
  it('generates a full tinted scale from a hex, keeping the gray lightness ladder', () => {
    const { scale, text } = generateNeutralScale('#0E1010');
    for (const key of ['light', 'lightA', 'dark', 'darkA'] as const)
      expect(scale[key]).toHaveLength(13);
    expect(text.dark).toHaveLength(4);
    const token = createLobeToken({ appearance: 'dark', neutralColor: '#0e1010' });
    expect(token.colorBgContainer).toBe(scale.dark[1]);
    expect(token.colorBgContainer).not.toBe(
      createLobeToken({ appearance: 'dark' }).colorBgContainer,
    );
  });

  it('uses a registered scale verbatim (exact dark colorBgContainer)', () => {
    registerLobeNeutral('foundry', withDarkBg('#0e1010'));
    expect(createLobeToken({ appearance: 'dark', neutralColor: 'foundry' }).colorBgContainer).toBe(
      '#0e1010',
    );
    expect(createLobeToken({ appearance: 'light', neutralColor: 'foundry' }).colorBgContainer).toBe(
      gray.light[0],
    );
  });

  it('rejects bad names and preset names', () => {
    expect(() => registerLobeNeutral("x'] *{", gray)).toThrow();
    expect(() => registerLobeNeutral('slate', gray)).toThrow();
  });

  it('emits light + dark rules, and nothing for presets', () => {
    registerLobeNeutral('foundry', withDarkBg('#0e1010'));
    const css = getCustomNeutralCss('foundry');
    expect(css).toContain(`[data-neutral-color='foundry'][data-theme='dark']`);
    expect(css).toContain('#0e1010');
    expect(getCustomNeutralCss('#0E1010')).toContain(`[data-neutral-color='#0e1010']`);
    expect(getCustomNeutralCss('slate')).toBe('');
  });

  it('setLobeTheme injects the stylesheet and useTheme follows', async () => {
    registerLobeNeutral('foundry', withDarkBg('#0e1010'));
    render(<Probe />);
    await act(async () => setLobeTheme({ appearance: 'dark', neutralColor: 'foundry' }));
    expect(document.documentElement.dataset.neutralColor).toBe('foundry');
    expect(document.getElementById('lobe-neutral-foundry')?.textContent).toContain('#0e1010');
    expect(screen.getByTestId('probe').textContent).toBe('#0e1010');

    await act(async () => setLobeTheme({ neutralColor: '#0E1010' }));
    expect(document.documentElement.dataset.neutralColor).toBe('#0e1010');
    expect(document.getElementById('lobe-neutral-0e1010')).not.toBeNull();
  });

  it('ThemeScope accepts a hex neutral', () => {
    render(
      <ThemeScope appearance="dark" neutralColor="#0e1010">
        <Probe />
      </ThemeScope>,
    );
    expect(screen.getByTestId('probe').textContent).toBe(
      generateNeutralScale('#0e1010').scale.dark[1],
    );
  });
});
