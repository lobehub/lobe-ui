import { act, render, screen } from '@testing-library/react';

import { createLobeToken } from './createLobeToken';
import { setLobeTheme, ThemeScope, useTheme, useThemeMode } from './scope';

const Probe = () => {
  const { appearance } = useThemeMode();
  const theme = useTheme();
  return <span data-testid="probe">{`${appearance}|${theme.colorPrimary}`}</span>;
};

afterEach(() => {
  for (const name of ['data-theme', 'data-primary-color', 'data-neutral-color'])
    document.documentElement.removeAttribute(name);
});

describe('theme scope', () => {
  it('follows <html> attributes written by setLobeTheme', async () => {
    render(<Probe />);
    expect(screen.getByTestId('probe').textContent).toBe(
      `light|${createLobeToken({ appearance: 'light' }).colorPrimary}`,
    );

    await act(async () => setLobeTheme({ appearance: 'dark', primaryColor: 'blue' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByTestId('probe').textContent).toBe(
      `dark|${createLobeToken({ appearance: 'dark', primaryColor: 'blue' }).colorPrimary}`,
    );
  });

  it('lets a nested scope override appearance and inherit the rest', () => {
    act(() => setLobeTheme({ appearance: 'light', primaryColor: 'red' }));
    render(
      <ThemeScope appearance="dark">
        <Probe />
      </ThemeScope>,
    );

    const probe = screen.getByTestId('probe');
    expect(probe.textContent).toBe(
      `dark|${createLobeToken({ appearance: 'dark', primaryColor: 'red' }).colorPrimary}`,
    );
    expect(probe.parentElement?.dataset).toMatchObject({ primaryColor: 'red', theme: 'dark' });
  });
});
