import { fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import { MotionProvider } from '@/MotionProvider';

import ConsoleShell from './ConsoleShell';

const mockMatchMedia = (matches: boolean) => {
  window.matchMedia = ((query: string) => ({
    addEventListener: () => {},
    addListener: () => {},
    dispatchEvent: () => false,
    matches,
    media: query,
    onchange: null,
    removeEventListener: () => {},
    removeListener: () => {},
  })) as unknown as typeof window.matchMedia;
};

const renderShell = () =>
  render(
    <MotionProvider motion={motion}>
      <ConsoleShell brand={<span>Brand</span>} navigation={<nav>Nav</nav>}>
        content
      </ConsoleShell>
    </MotionProvider>,
  );

describe('ConsoleShell compact drawer', () => {
  test('the close button sits in the brand row instead of floating over it', async () => {
    mockMatchMedia(true);
    renderShell();

    fireEvent.click(screen.getByLabelText('Open navigation'));
    const close = await screen.findByLabelText('Close navigation');

    expect(close.parentElement!.textContent).toContain('Brand');
    expect(screen.queryByLabelText('Close')).toBeNull();
  });

  test('desktop has no close button', () => {
    mockMatchMedia(false);
    renderShell();

    expect(screen.queryByLabelText('Close navigation')).toBeNull();
  });
});
