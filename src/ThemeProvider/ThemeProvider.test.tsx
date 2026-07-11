import { cleanup, render } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest';

import { LOBE_THEME_APP_ID } from './constants';
import ThemeProvider from './ThemeProvider';

beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    })),
  );
});

afterAll(() => vi.unstubAllGlobals());
afterEach(cleanup);

it('uses a caller-provided portal app id', () => {
  render(
    <ThemeProvider appId="demo-button" enableCustomFonts={false} enableGlobalStyle={false}>
      content
    </ThemeProvider>,
  );

  expect(document.querySelector('#demo-button')?.textContent).toContain('content');
  expect(document.querySelector(`#${LOBE_THEME_APP_ID}`)).toBeNull();
});

it('preserves the default portal app id for existing callers', () => {
  render(
    <ThemeProvider enableCustomFonts={false} enableGlobalStyle={false}>
      content
    </ThemeProvider>,
  );

  expect(document.querySelector(`#${LOBE_THEME_APP_ID}`)?.textContent).toContain('content');
});
