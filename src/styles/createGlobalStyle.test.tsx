import { render } from '@testing-library/react';

import { createGlobalStyle } from './createGlobalStyle';
import { ThemeScope } from './theme/scope';

const SELECTOR = '.global-style-probe';

const ProbeStyle = createGlobalStyle(
  ({ theme }) => `${SELECTOR} { color: ${theme.isDarkMode ? 'black' : 'white'}; }`,
);

const probeRules = () =>
  [...document.querySelectorAll('style')]
    .flatMap((style) => [...(style.sheet?.cssRules ?? [])].map((rule) => rule.cssText))
    .filter((rule) => rule.startsWith(SELECTOR));

describe('createGlobalStyle', () => {
  it('lets the current theme win after switching back to a previous theme', () => {
    const { rerender } = render(
      <ThemeScope appearance="light">
        <ProbeStyle />
      </ThemeScope>,
    );
    rerender(
      <ThemeScope appearance="dark">
        <ProbeStyle />
      </ThemeScope>,
    );
    rerender(
      <ThemeScope appearance="light">
        <ProbeStyle />
      </ThemeScope>,
    );

    expect(probeRules().at(-1)).toContain('color: white');
  });

  it('removes its rules on unmount', () => {
    const { unmount } = render(
      <ThemeScope appearance="dark">
        <ProbeStyle />
      </ThemeScope>,
    );
    unmount();

    expect(probeRules().some((rule) => rule.includes('color: black'))).toBe(false);
  });
});
