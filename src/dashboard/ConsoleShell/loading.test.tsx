import { render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import { MotionProvider } from '@/MotionProvider';

import ConsoleNavSkeleton from '../ConsoleNav/Skeleton';
import ConsoleShell from './ConsoleShell';

const wrap = (node: ReactNode) => <MotionProvider motion={motion}>{node}</MotionProvider>;

describe('ConsoleShell loading', () => {
  beforeEach(() => {
    window.matchMedia = ((query: string) => ({
      addEventListener: () => {},
      addListener: () => {},
      dispatchEvent: () => false,
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: () => {},
      removeListener: () => {},
    })) as unknown as typeof window.matchMedia;
  });

  it('swaps nav, footer and body for placeholders and keeps the brand', () => {
    const { container } = render(
      wrap(
        <ConsoleShell
          loading
          brand={<span>Brand</span>}
          footer={<span>Account</span>}
          navigation={<nav>Real nav</nav>}
        >
          <p>Page</p>
        </ConsoleShell>,
      ),
    );
    expect(screen.getByText('Brand')).toBeTruthy();
    expect(screen.queryByText('Real nav')).toBeNull();
    expect(screen.queryByText('Account')).toBeNull();
    expect(screen.queryByText('Page')).toBeNull();
    expect(container.querySelector('[data-console-nav-skeleton]')).toBeTruthy();
    expect(container.querySelector('main')?.getAttribute('aria-busy')).toBe('true');
  });

  it('renders custom loading content', () => {
    render(
      wrap(
        <ConsoleShell loading loadingContent={<p>Hydrating</p>}>
          <p>Page</p>
        </ConsoleShell>,
      ),
    );
    expect(screen.getByText('Hydrating')).toBeTruthy();
  });

  it('mirrors group item counts', () => {
    const { container } = render(
      <ConsoleNavSkeleton
        items={0}
        groups={[
          {
            items: [
              { href: '/a', label: 'A' },
              { href: '/b', label: 'B' },
            ],
            key: 'g',
            label: 'G',
          },
        ]}
      />,
    );
    expect(container.querySelectorAll('[data-indent="1"]').length).toBe(2);
  });
});
