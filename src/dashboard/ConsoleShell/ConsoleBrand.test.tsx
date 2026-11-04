import { render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import { MotionProvider } from '@/MotionProvider';

import ConsoleBrand from './ConsoleBrand';
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

describe('ConsoleBrand', () => {
  test('keeps the mark mounted when the title fades on the rail', () => {
    mockMatchMedia(false);
    render(
      <MotionProvider motion={motion}>
        <ConsoleShell
          collapsed
          brand={<ConsoleBrand logo={<span data-testid="brand-mark">◆</span>} title="Console" />}
          navigation={<nav>Nav</nav>}
        >
          content
        </ConsoleShell>
      </MotionProvider>,
    );

    expect(screen.getByTestId('brand-mark')).toBeTruthy();
    expect(screen.getByLabelText('Console')).toBeTruthy();
    // Title text stays in the DOM for the fade, but the mark must remain visible size-wise.
    expect(screen.getByText('Console')).toBeTruthy();
  });
});
