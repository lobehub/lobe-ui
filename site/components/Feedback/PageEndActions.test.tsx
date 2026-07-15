import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentType } from 'react';
import { useEffect } from 'react';

import { type GiscusModule,PageEndActions } from './PageEndActions';

const themeMocks = vi.hoisted(() => ({ appearance: 'light' as 'dark' | 'light' }));

vi.mock('../../app/providers/SiteProviders', () => ({
  useSiteTheme: () => ({ appearance: themeMocks.appearance }),
}));

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

const openDiscussion = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Show discussion' }));
};

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.theme;
  mountCount = 0;
  themeMocks.appearance = 'light';
  vi.unstubAllGlobals();
});

it('records a local helpful response with icon actions', () => {
  const { container } = render(<PageEndActions pathname="/components/button" />);

  expect(screen.getByText('Helpful?')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Yes, this page was helpful' }));

  expect(screen.getByRole('status').textContent).toContain('Thanks');
  expect(container.firstElementChild?.getAttribute('data-pagefind-ignore')).toBe('all');
});

it('resets the local confirmation when the documentation pathname changes', () => {
  const { rerender } = render(<PageEndActions pathname="/components/button" />);
  fireEvent.click(screen.getByRole('button', { name: 'No, this page was not helpful' }));
  expect(screen.getByRole('status')).toBeTruthy();

  rerender(<PageEndActions pathname="/components/input" />);

  expect(screen.queryByText('Thanks')).toBeNull();
  expect(screen.getByRole('button', { name: 'Yes, this page was helpful' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'No, this page was not helpful' })).toBeTruthy();

  rerender(<PageEndActions pathname="/components/button" />);
  expect(screen.queryByText('Thanks')).toBeNull();
});

it('does not load giscus until discussion is opened and maps by page title', async () => {
  const loadGiscus = vi.fn(async () => moduleFixture);
  render(<PageEndActions loadGiscus={loadGiscus} pathname="/components/button" />);

  expect(loadGiscus).not.toHaveBeenCalled();
  expect(screen.queryByText('Discussion loaded')).toBeNull();

  openDiscussion();

  expect(await screen.findByText('Discussion loaded')).toBeTruthy();
  expect(loadGiscus).toHaveBeenCalledTimes(1);
  expect(screen.getByText('Discussion loaded').dataset.mapping).toBe('title');
  expect(screen.getByText('Discussion loaded').dataset.strict).toBe('0');
  expect(screen.getByText('Discussion loaded').dataset.term).toBeUndefined();
});

it('synchronizes the rendered discussion theme with React theme state', async () => {
  const { rerender } = render(
    <PageEndActions loadGiscus={async () => moduleFixture} pathname="/components/button" />,
  );
  openDiscussion();
  const discussion = await screen.findByText('Discussion loaded');
  expect(discussion.dataset.theme).toBe('light');

  themeMocks.appearance = 'dark';
  rerender(<PageEndActions loadGiscus={async () => moduleFixture} pathname="/components/button" />);
  await waitFor(() => expect(discussion.dataset.theme).toBe('dark'));
});

it('closes discussion on SPA navigation and remounts when reopened', async () => {
  const loadGiscus = vi.fn(async () => moduleFixture);
  const { rerender } = render(
    <PageEndActions loadGiscus={loadGiscus} pathname="/components/button" />,
  );
  openDiscussion();
  await screen.findByText('Discussion loaded');
  const afterFirst = mountCount;
  expect(afterFirst).toBeGreaterThanOrEqual(1);

  rerender(<PageEndActions loadGiscus={loadGiscus} pathname="/components/segmented" />);

  expect(screen.queryByText('Discussion loaded')).toBeNull();
  openDiscussion();
  await screen.findByText('Discussion loaded');
  expect(mountCount).toBeGreaterThan(afterFirst);
  expect(loadGiscus).toHaveBeenCalledTimes(1);
});

it('retries a rejected import from the compact error row', async () => {
  const loadGiscus = vi
    .fn<() => Promise<GiscusModule>>()
    .mockRejectedValueOnce(new Error('network unavailable'))
    .mockResolvedValueOnce(moduleFixture);
  render(<PageEndActions loadGiscus={loadGiscus} pathname="/components/button" />);

  openDiscussion();
  expect((await screen.findByRole('alert')).textContent).toContain(
    'Discussion could not be loaded',
  );
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

  expect(await screen.findByText('Discussion loaded')).toBeTruthy();
  expect(loadGiscus).toHaveBeenCalledTimes(2);
});

it('ignores a stale pending module when the loader changes', async () => {
  let resolveOld: ((module: GiscusModule) => void) | undefined;
  const oldLoad = vi.fn(
    () =>
      new Promise<GiscusModule>((resolve) => {
        resolveOld = resolve;
      }),
  );
  const NewGiscus = () => <output>New discussion loaded</output>;
  const newLoad = vi.fn(async () => ({ default: NewGiscus }) as GiscusModule);
  const { rerender } = render(
    <PageEndActions loadGiscus={oldLoad} pathname="/components/button" />,
  );
  openDiscussion();
  expect(oldLoad).toHaveBeenCalledOnce();

  rerender(<PageEndActions loadGiscus={newLoad} pathname="/components/button" />);
  expect(await screen.findByText('New discussion loaded')).toBeTruthy();

  await act(async () => {
    resolveOld?.(moduleFixture);
    await Promise.resolve();
  });
  expect(screen.queryByText('Discussion loaded')).toBeNull();
  expect(screen.getByText('New discussion loaded')).toBeTruthy();
});

it('invalidates the old loader when props change while a request is pending', async () => {
  let resolveOld: ((module: GiscusModule) => void) | undefined;
  const oldLoad = vi.fn(
    () =>
      new Promise<GiscusModule>((resolve) => {
        resolveOld = resolve;
      }),
  );
  const newLoad = vi.fn(async () => moduleFixture);
  const { rerender } = render(
    <PageEndActions loadGiscus={oldLoad} pathname="/components/button" />,
  );
  openDiscussion();
  expect(oldLoad).toHaveBeenCalledOnce();

  rerender(<PageEndActions loadGiscus={newLoad} pathname="/components/button" />);
  await act(async () => {
    resolveOld?.(moduleFixture);
    await Promise.resolve();
  });

  expect(await screen.findByText('Discussion loaded')).toBeTruthy();
  expect(newLoad).toHaveBeenCalledOnce();
  expect(screen.queryByText('Discussion loaded') && newLoad).toBeTruthy();
});
