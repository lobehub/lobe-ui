import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import * as scroller from '../../lib/scroller';
import { TableOfContents } from './TableOfContents';

if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as never;
}

const rect = (top: number, bottom: number) =>
  ({
    bottom,
    height: bottom - top,
    left: 0,
    right: 0,
    toJSON: () => ({}),
    top,
    width: 0,
    x: 0,
    y: top,
  }) as DOMRect;

afterEach(() => {
  vi.restoreAllMocks();
});

it('renders links from compile-time heading identifiers without rewriting them', async () => {
  render(
    <>
      <div id="usage" />
      <main id="toc-content">
        <h2 id="usage">Usage</h2>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="compiled" />
    </>,
  );

  const link = await screen.findByRole('link', { name: 'Usage' });
  const heading = document.querySelector<HTMLHeadingElement>('#toc-content h2');

  expect(link.getAttribute('href')).toBe('#usage');
  expect(heading?.id).toBe('usage');
});

it('skips a heading without a compile-time identifier and never mutates the DOM', async () => {
  render(
    <>
      <main id="toc-content">
        <h2>Missing identifier</h2>
        <h3 id="configured">Configured</h3>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="missing" />
    </>,
  );

  await screen.findByRole('link', { name: 'Configured' });
  expect(screen.queryByRole('link', { name: 'Missing identifier' })).toBeNull();
  expect(document.querySelector<HTMLHeadingElement>('#toc-content h2')?.hasAttribute('id')).toBe(
    false,
  );
});

it('spring-scrolls to the heading when a toc link is clicked', async () => {
  const springScrollToElement = vi
    .spyOn(scroller, 'springScrollToElement')
    .mockReturnValue({ stop() {} } as never);

  render(
    <>
      <main id="toc-content">
        <h2 id="usage">Usage</h2>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="click" />
    </>,
  );

  const link = await screen.findByRole('link', { name: 'Usage' });
  const heading = document.getElementById('usage');
  fireEvent.click(link);

  expect(springScrollToElement).toHaveBeenCalledWith(heading, -100);
});

it('scrolls the active link into view inside the viewport', async () => {
  render(
    <>
      <main id="toc-content">
        <h2 id="alpha">Alpha</h2>
        <h2 id="omega">Omega</h2>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="scroll" />
    </>,
  );

  const omega = await screen.findByRole('link', { name: 'Omega' });
  const viewport = document.querySelector<HTMLElement>('[data-toc-viewport]');
  expect(viewport).not.toBeNull();

  viewport!.getBoundingClientRect = () => rect(0, 100);
  omega.getBoundingClientRect = () => rect(150, 170);

  fireEvent.click(omega);
  expect(viewport!.scrollTop).toBeGreaterThan(0);
});
