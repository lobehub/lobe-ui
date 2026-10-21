import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
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

const region = (name: 'bar' | 'outline' | 'rail') => {
  const element = document.querySelector<HTMLElement>(`[data-toc-${name}]`);
  expect(element).not.toBeNull();
  return within(element!);
};

const mockSpringScroll = () =>
  vi.spyOn(scroller, 'springScrollToElement').mockReturnValue({ stop() {} } as never);

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

  await screen.findAllByRole('link', { hidden: true, name: 'Usage' });
  const link = region('outline').getByRole('link', { hidden: true, name: 'Usage' });
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

  await screen.findAllByRole('link', { hidden: true, name: 'Configured' });
  expect(screen.queryByRole('link', { hidden: true, name: 'Missing identifier' })).toBeNull();
  expect(document.querySelector<HTMLHeadingElement>('#toc-content h2')?.hasAttribute('id')).toBe(
    false,
  );
});

it('excludes headings inside regions that are not part of the document outline', async () => {
  render(
    <>
      <main id="toc-content">
        <h2 id="usage">Usage</h2>
        <section data-toc-ignore="">
          <h3 id="demo-title">Demo title</h3>
          <div>
            <h3 id="preview-heading">Preview heading</h3>
          </div>
        </section>
        <h3 id="configuration">Configuration</h3>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="ignored-region" />
    </>,
  );

  await screen.findAllByRole('link', { hidden: true, name: 'Usage' });
  const outline = region('outline');
  expect(outline.getByRole('link', { hidden: true, name: 'Configuration' })).toBeTruthy();
  expect(screen.queryByRole('link', { hidden: true, name: 'Demo title' })).toBeNull();
  expect(screen.queryByRole('link', { hidden: true, name: 'Preview heading' })).toBeNull();
});

it('spring-scrolls to the heading when a toc link is clicked', async () => {
  const springScrollToElement = mockSpringScroll();

  render(
    <>
      <main id="toc-content">
        <h2 id="usage">Usage</h2>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="click" />
    </>,
  );

  await screen.findAllByRole('link', { hidden: true, name: 'Usage' });
  fireEvent.click(region('outline').getByRole('link', { hidden: true, name: 'Usage' }));

  expect(springScrollToElement).toHaveBeenCalledWith(
    document.getElementById('usage'),
    scroller.HEADING_SCROLL_OFFSET,
  );
});

it('scrolls the active link into view inside the viewport', async () => {
  mockSpringScroll();
  render(
    <>
      <main id="toc-content">
        <h2 id="alpha">Alpha</h2>
        <h2 id="omega">Omega</h2>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="scroll" />
    </>,
  );

  await screen.findAllByRole('link', { hidden: true, name: 'Omega' });
  const omega = region('outline').getByRole('link', { hidden: true, name: 'Omega' });
  const viewport = document.querySelector<HTMLElement>('[data-toc-viewport]');
  expect(viewport).not.toBeNull();

  viewport!.getBoundingClientRect = () => rect(0, 100);
  omega.getBoundingClientRect = () => rect(150, 170);

  fireEvent.click(omega);
  expect(viewport!.scrollTop).toBeGreaterThan(0);
});

it('highlights the parent section while one of its nested headings is active', async () => {
  mockSpringScroll();
  render(
    <>
      <main id="toc-content">
        <h2 id="usage">Usage</h2>
        <h2 id="variants">Variants</h2>
        <h3 id="solid">Solid</h3>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="parent" />
    </>,
  );

  await screen.findAllByRole('link', { hidden: true, name: 'Solid' });
  const outline = region('outline');
  fireEvent.click(outline.getByRole('link', { hidden: true, name: 'Solid' }));

  expect(
    outline.getByRole('link', { hidden: true, name: 'Solid' }).getAttribute('aria-current'),
  ).toBe('location');
  expect(
    outline.getByRole('link', { hidden: true, name: 'Variants' }).hasAttribute('data-toc-parent'),
  ).toBe(true);
  expect(
    outline.getByRole('link', { hidden: true, name: 'Usage' }).hasAttribute('data-toc-parent'),
  ).toBe(false);
});

it('draws the outline track as one svg path', async () => {
  render(
    <>
      <main id="toc-content">
        <h2 id="usage">Usage</h2>
        <h3 id="nested">Nested</h3>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="track" />
    </>,
  );

  await screen.findAllByRole('link', { hidden: true, name: 'Usage' });
  const track = document.querySelector('[data-toc-outline] path[data-toc-track]');

  await waitFor(() => expect(track?.getAttribute('d')).toMatch(/^M/));
});

it('renders one rail tick per heading that scrolls to it', async () => {
  const springScrollToElement = mockSpringScroll();
  render(
    <>
      <main id="toc-content">
        <h2 id="usage">Usage</h2>
        <h3 id="nested">Nested</h3>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="rail" />
    </>,
  );

  await screen.findAllByRole('link', { hidden: true, name: 'Usage' });
  const rail = region('rail');
  expect(rail.getAllByRole('link', { hidden: true })).toHaveLength(2);

  fireEvent.click(rail.getByRole('link', { hidden: true, name: 'Nested' }));
  expect(springScrollToElement).toHaveBeenCalledWith(
    document.getElementById('nested'),
    scroller.HEADING_SCROLL_OFFSET,
  );
});

it('shows the hovered heading title beside the rail', async () => {
  render(
    <>
      <main id="toc-content">
        <h2 id="usage">Usage</h2>
        <h2 id="api">API</h2>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="rail-hover" />
    </>,
  );

  await screen.findAllByRole('link', { hidden: true, name: 'API' });
  const rail = region('rail');
  fireEvent.mouseEnter(rail.getByRole('link', { hidden: true, name: 'API' }));

  expect(document.querySelector('[data-toc-rail-label]')?.textContent).toBe('API');
});

it('names the active section in the sticky bar and opens the outline from it', async () => {
  const springScrollToElement = mockSpringScroll();
  render(
    <>
      <main id="toc-content">
        <h2 id="usage">Usage</h2>
        <h2 id="api">API</h2>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="bar" />
    </>,
  );

  await screen.findAllByRole('link', { hidden: true, name: 'Usage' });
  const trigger = region('bar').getByRole('button', {
    hidden: true,
    name: 'On this page: Usage',
  });

  fireEvent.click(trigger);
  await waitFor(() =>
    expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe(
      'On this page',
    ),
  );
  const popupLink = await waitFor(() => {
    const link = document.querySelector<HTMLAnchorElement>('[data-toc-popup] a[href="#api"]');
    expect(link).not.toBeNull();
    return link!;
  });
  fireEvent.click(popupLink);

  expect(springScrollToElement).toHaveBeenCalledWith(
    document.getElementById('api'),
    scroller.HEADING_SCROLL_OFFSET,
  );
  expect(trigger.getAttribute('aria-label')).toBe('On this page: API');
});

it('prerenders the compiled outline before the client scans the page', () => {
  const html = renderToString(
    <TableOfContents
      contentId="absent"
      scopeKey="ssr"
      headings={[
        { id: 'usage', level: 2, title: 'Usage' },
        { id: 'solid', level: 3, title: 'Solid' },
      ]}
    />,
  );

  expect(html).toContain('data-docs-toc');
  expect(html).toContain('data-toc-bar');
  expect(html).toContain('href="#solid"');
  expect(html).toContain('Usage');
});

it('switches to the next page outline as soon as the scope changes', () => {
  const { rerender } = render(
    <TableOfContents
      contentId="absent"
      headings={[{ id: 'alpha', level: 2, title: 'Alpha' }]}
      scopeKey="/alpha"
    />,
  );

  rerender(
    <TableOfContents
      contentId="absent"
      headings={[{ id: 'beta', level: 2, title: 'Beta' }]}
      scopeKey="/beta"
    />,
  );

  expect(region('outline').getByRole('link', { hidden: true, name: 'Beta' })).toBeTruthy();
  expect(screen.queryByRole('link', { hidden: true, name: 'Alpha' })).toBeNull();
});
