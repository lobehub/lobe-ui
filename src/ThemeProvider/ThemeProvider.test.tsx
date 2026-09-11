import { cleanup, render, screen } from '@testing-library/react';
import { App } from 'antd';
import { use, useEffect } from 'react';
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest';

import { MotionComponent, type MotionComponentType } from '@/MotionProvider';

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

it('provides the motion context to antd static notification holders', async () => {
  const motion = {} as MotionComponentType;
  const Probe = () => (
    <span data-testid="probe">{use(MotionComponent) === motion ? 'ok' : 'missing'}</span>
  );
  const Trigger = () => {
    const { notification } = App.useApp();
    useEffect(() => {
      notification.open({ description: <Probe />, title: 'x' });
    }, [notification]);
    return null;
  };

  render(
    <ThemeProvider enableCustomFonts={false} enableGlobalStyle={false} motion={motion}>
      <Trigger />
    </ThemeProvider>,
  );

  expect((await screen.findByTestId('probe')).textContent).toBe('ok');
});
