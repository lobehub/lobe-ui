import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentType } from 'react';
import { useEffect } from 'react';

import LazyGiscus, { type GiscusModule } from './LazyGiscus';

const themeMocks = vi.hoisted(() => ({ appearance: 'light' as 'dark' | 'light' }));

vi.mock('../../app/providers/SiteProviders', () => ({
  useSiteTheme: () => ({ appearance: themeMocks.appearance }),
}));

let intersectionCallback: IntersectionObserverCallback | undefined;
let mountCount = 0;

const GiscusFixture: ComponentType<Record<string, unknown>> = (props) => {
  useEffect(() => {
    mountCount += 1;
  }, []);

  return (
    <output
      data-category={String(props.category)}
      data-mapping={String(props.mapping)}
      data-repo={String(props.repo)}
      data-strict={String(props.strict)}
      data-term={props.term === undefined ? undefined : String(props.term)}
      data-theme={String(props.theme)}
    >
      Discussion loaded
    </output>
  );
};

const moduleFixture = { default: GiscusFixture } as unknown as GiscusModule;

class IntersectionObserverFixture {
  constructor(
    callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {
    intersectionCallback = callback;
  }

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
  root = null;
  rootMargin = '400px 0px';
  thresholds = [0];
}

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.theme;
  intersectionCallback = undefined;
  mountCount = 0;
  themeMocks.appearance = 'light';
  vi.unstubAllGlobals();
});

it('imports once only after entering the 400px viewport margin and maps by page title', async () => {
  vi.stubGlobal('IntersectionObserver', IntersectionObserverFixture);
  const loadGiscus = vi.fn(async () => moduleFixture);
  render(<LazyGiscus loadGiscus={loadGiscus} pathname="/components/button" />);

  expect(loadGiscus).not.toHaveBeenCalled();
  expect(intersectionCallback).toBeTypeOf('function');
  act(() => {
    intersectionCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    intersectionCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });

  expect(await screen.findByText('Discussion loaded')).toBeTruthy();
  expect(loadGiscus).toHaveBeenCalledTimes(1);
  expect(screen.getByText('Discussion loaded').dataset.mapping).toBe('title');
  expect(screen.getByText('Discussion loaded').dataset.strict).toBe('0');
  expect(screen.getByText('Discussion loaded').dataset.term).toBeUndefined();
});

it('synchronizes the rendered discussion theme with React theme state', async () => {
  vi.stubGlobal('IntersectionObserver', IntersectionObserverFixture);
  const { rerender } = render(
    <LazyGiscus loadGiscus={async () => moduleFixture} pathname="/components/button" />,
  );
  act(() => {
    intersectionCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
  const discussion = await screen.findByText('Discussion loaded');
  expect(discussion.dataset.theme).toBe('light');

  themeMocks.appearance = 'dark';
  rerender(<LazyGiscus loadGiscus={async () => moduleFixture} pathname="/components/button" />);
  await waitFor(() => expect(discussion.dataset.theme).toBe('dark'));
});

it('remounts the title-mapped discussion when SPA navigation changes the pathname', async () => {
  vi.stubGlobal('IntersectionObserver', IntersectionObserverFixture);
  const loadGiscus = vi.fn(async () => moduleFixture);
  const { rerender } = render(<LazyGiscus loadGiscus={loadGiscus} pathname="/components/button" />);
  act(() => {
    intersectionCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
  await screen.findByText('Discussion loaded');
  expect(mountCount).toBe(1);

  rerender(<LazyGiscus loadGiscus={loadGiscus} pathname="/components/segmented" />);

  await waitFor(() => expect(mountCount).toBe(2));
  expect(loadGiscus).toHaveBeenCalledTimes(1);
});

it('provides manual loading without IntersectionObserver and retries a rejected import', async () => {
  const loadGiscus = vi
    .fn<() => Promise<GiscusModule>>()
    .mockRejectedValueOnce(new Error('network unavailable'))
    .mockResolvedValueOnce(moduleFixture);
  render(<LazyGiscus loadGiscus={loadGiscus} pathname="/components/button" />);

  fireEvent.click(screen.getByRole('button', { name: 'Load discussion' }));
  expect((await screen.findByRole('alert')).textContent).toContain(
    'Discussion could not be loaded',
  );
  fireEvent.click(screen.getByRole('button', { name: 'Retry discussion' }));

  expect(await screen.findByText('Discussion loaded')).toBeTruthy();
  expect(loadGiscus).toHaveBeenCalledTimes(2);
});

it('ignores a stale pending module when the loader changes', async () => {
  vi.stubGlobal('IntersectionObserver', IntersectionObserverFixture);
  let resolveOld: ((module: GiscusModule) => void) | undefined;
  const oldLoad = vi.fn(
    () =>
      new Promise<GiscusModule>((resolve) => {
        resolveOld = resolve;
      }),
  );
  const NewGiscus = () => <output>New discussion loaded</output>;
  const newLoad = vi.fn(async () => ({ default: NewGiscus }) as GiscusModule);
  const { rerender } = render(<LazyGiscus loadGiscus={oldLoad} pathname="/components/button" />);
  act(() => {
    intersectionCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
  expect(oldLoad).toHaveBeenCalledOnce();

  rerender(<LazyGiscus loadGiscus={newLoad} pathname="/components/button" />);
  act(() => {
    intersectionCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
  expect(await screen.findByText('New discussion loaded')).toBeTruthy();

  await act(async () => {
    resolveOld?.(moduleFixture);
    await Promise.resolve();
  });
  expect(screen.queryByText('Discussion loaded')).toBeNull();
  expect(screen.getByText('New discussion loaded')).toBeTruthy();
});

it('invalidates the old loader immediately when props change before a new intersection', async () => {
  vi.stubGlobal('IntersectionObserver', IntersectionObserverFixture);
  let resolveOld: ((module: GiscusModule) => void) | undefined;
  const oldLoad = vi.fn(
    () =>
      new Promise<GiscusModule>((resolve) => {
        resolveOld = resolve;
      }),
  );
  const newLoad = vi.fn(async () => moduleFixture);
  const { rerender } = render(<LazyGiscus loadGiscus={oldLoad} pathname="/components/button" />);
  act(() => {
    intersectionCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
  expect(oldLoad).toHaveBeenCalledOnce();

  rerender(<LazyGiscus loadGiscus={newLoad} pathname="/components/button" />);
  await act(async () => {
    resolveOld?.(moduleFixture);
    await Promise.resolve();
  });

  expect(screen.queryByText('Discussion loaded')).toBeNull();
  expect(newLoad).not.toHaveBeenCalled();
});
