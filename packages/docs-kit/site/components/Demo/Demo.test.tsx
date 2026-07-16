import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentType } from 'react';
import { renderToString } from 'react-dom/server';

import type { DemoModule } from '../../types/demo';
import { Demo } from './Demo';
import { styles } from './style';

const activityMocks = vi.hoisted(() => ({ cleanups: 0, starts: 0 }));

vi.mock('react-live', async () => {
  const React = await import('react');

  return {
    Editor: ({ code, onChange }: { code: string; onChange?: (value: string) => void }) => (
      <textarea value={code} onChange={(event) => onChange?.(event.currentTarget.value)} />
    ),
    renderElementAsync: (
      { code }: { code: string },
      onResult: (component: ComponentType) => void,
    ) => {
      const Result = () => {
        const [count, setCount] = React.useState(0);
        React.useEffect(() => {
          if (!code.includes('Effect lifecycle')) return;
          activityMocks.starts += 1;
          return () => {
            activityMocks.cleanups += 1;
          };
        }, []);
        if (code.includes('Stateful preview')) {
          return (
            <button onClick={() => setCount((value) => value + 1)}>Preview count {count}</button>
          );
        }
        return (
          <div>
            {code.includes('Persisted edit') ? 'Persisted edit result' : 'Edited preview result'}
          </div>
        );
      };
      onResult(Result);
    },
  };
});

const descriptor: DemoModule = {
  editable: true,
  id: 'height-zero',
  legacyIds: [],
  load: async () => () => null,
  loadScope: async () => ({}),
  routeId: 'components/HeightZero/index',
  source: 'export default () => null;',
  sourcePath: 'src/HeightZero/demos/index.tsx',
};

beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      addEventListener: vi.fn(),
      matches: false,
      media: '',
      removeEventListener: vi.fn(),
    })),
  );
});

afterAll(() => {
  vi.unstubAllGlobals();
});

it('preserves an explicit zero preview height', () => {
  const html = renderToString(<Demo height={0} of={descriptor} />);

  expect(html).toContain('--demo-frame-height:0px');
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

it('does not load editable scope until source editing is explicitly expanded', async () => {
  const loadScope = vi.fn(async () => ({}));
  const editableDescriptor = { ...descriptor, id: 'explicit-expand', loadScope };

  render(<Demo of={editableDescriptor} />);

  expect(loadScope).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Show source editor' }));
  await waitFor(() => expect(loadScope).toHaveBeenCalledTimes(1));
});

it('replaces the canonical preview in place once the live preview is ready', async () => {
  const canonicalDescriptor: DemoModule = {
    ...descriptor,
    id: 'single-preview',
    load: async () => () => <div>Canonical result</div>,
    source: 'export default () => <div>Edited result</div>;',
  };
  const { container } = render(<Demo of={canonicalDescriptor} />);

  expect(await screen.findByText('Canonical result')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Show source editor' }));

  expect(await screen.findByText('Edited preview result')).toBeTruthy();
  await waitFor(() => expect(screen.queryByText('Canonical result')).toBeNull());
  expect(container.querySelectorAll(`.${styles.preview}`)).toHaveLength(1);
  expect(screen.getByLabelText('Edited demo preview').closest(`.${styles.preview}`)).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'Hide source editor' }));

  expect(await screen.findByText('Canonical result')).toBeTruthy();
  expect(screen.getByLabelText('Edited demo preview')).toHaveProperty('hidden', true);
});

it('persists source expansion as a per-demo local preference', async () => {
  const persistedDescriptor = { ...descriptor, id: 'persisted-editor' };
  const first = render(<Demo of={persistedDescriptor} />);
  fireEvent.click(screen.getByRole('button', { name: 'Show source editor' }));
  await screen.findByRole('button', { name: 'Hide source editor' });
  first.unmount();

  render(<Demo of={persistedDescriptor} />);

  expect(await screen.findByRole('button', { name: 'Hide source editor' })).toBeTruthy();
});

it('keeps the edited session mounted and inaccessible while the editor is collapsed', async () => {
  const loadScope = vi.fn(async () => ({}));
  const editableDescriptor = { ...descriptor, id: 'persistent-session', loadScope };
  render(<Demo of={editableDescriptor} />);

  fireEvent.click(screen.getByRole('button', { name: 'Show source editor' }));
  const textarea = await screen.findByRole('textbox', { name: 'Demo source editor' });
  if (!(textarea instanceof HTMLTextAreaElement)) {
    throw new TypeError('Expected the react-live editor fixture');
  }
  fireEvent.change(textarea, {
    target: { value: 'export default () => <div>Persisted edit</div>;' },
  });
  expect(await screen.findByText('Persisted edit result')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'Hide source editor' }));
  expect(screen.queryByRole('textbox', { name: 'Demo source editor' })).toBeNull();
  expect(
    screen.getByText('Persisted edit result').closest<HTMLElement>(`.${styles.liveStage}`)?.hidden,
  ).toBe(true);

  fireEvent.click(screen.getByRole('button', { name: 'Show source editor' }));
  const reopened = await screen.findByRole('textbox', { name: 'Demo source editor' });
  expect((reopened as HTMLTextAreaElement).value).toContain('Persisted edit');
  await waitFor(() =>
    expect(
      screen.getByLabelText('Edited demo preview').querySelector('[data-live-state="active"]')
        ?.textContent,
    ).toContain('Persisted edit result'),
  );
  expect(loadScope).toHaveBeenCalledTimes(1);
});

it('disconnects editor effects while collapsed and reconnects them without losing the draft', async () => {
  activityMocks.cleanups = 0;
  activityMocks.starts = 0;
  const loadScope = vi.fn(async () => ({}));
  const editableDescriptor = {
    ...descriptor,
    id: 'activity-session',
    loadScope,
    source: 'export default () => <div>Effect lifecycle</div>;',
  };
  render(<Demo of={editableDescriptor} />);

  fireEvent.click(screen.getByRole('button', { name: 'Show source editor' }));
  const textarea = await screen.findByRole('textbox', { name: 'Demo source editor' });
  if (!(textarea instanceof HTMLTextAreaElement)) {
    throw new TypeError('Expected the react-live editor fixture');
  }
  fireEvent.change(textarea, {
    target: {
      value: 'export default () => <div>Effect lifecycle Persisted edit</div>;',
    },
  });
  expect(await screen.findByText('Persisted edit result')).toBeTruthy();
  await waitFor(() => expect(activityMocks.starts).toBeGreaterThan(0));
  const cleanupBeforeCollapse = activityMocks.cleanups;

  fireEvent.click(screen.getByRole('button', { name: 'Hide source editor' }));

  await waitFor(() => expect(activityMocks.cleanups).toBeGreaterThan(cleanupBeforeCollapse));
  expect(screen.queryByRole('textbox', { name: 'Demo source editor' })).toBeNull();
  const startsBeforeReopen = activityMocks.starts;

  fireEvent.click(screen.getByRole('button', { name: 'Show source editor' }));

  await waitFor(() => expect(activityMocks.starts).toBeGreaterThan(startsBeforeReopen));
  const reopened = await screen.findByRole('textbox', { name: 'Demo source editor' });
  expect((reopened as HTMLTextAreaElement).value).toContain('Effect lifecycle Persisted edit');
  expect(loadScope).toHaveBeenCalledTimes(1);
});

it('preserves edited preview state when Activity reconnects after collapse', async () => {
  const editableDescriptor = {
    ...descriptor,
    id: 'stateful-activity-session',
    source: 'export default () => <button>Stateful preview</button>;',
  };
  render(<Demo of={editableDescriptor} />);

  fireEvent.click(screen.getByRole('button', { name: 'Show source editor' }));
  const preview = await screen.findByLabelText('Edited demo preview');
  await waitFor(() =>
    expect(preview.querySelector('[data-live-state="active"] button')?.textContent).toBe(
      'Preview count 0',
    ),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Preview count 0' }));
  expect(preview.querySelector('[data-live-state="active"] button')?.textContent).toBe(
    'Preview count 1',
  );

  fireEvent.click(screen.getByRole('button', { name: 'Hide source editor' }));
  fireEvent.click(screen.getByRole('button', { name: 'Show source editor' }));

  await waitFor(() =>
    expect(preview.querySelector('[data-live-state="active"] button')?.textContent).toBe(
      'Preview count 1',
    ),
  );
});

it('keeps source and every non-edit action available for read-only demos', async () => {
  const readOnlyDescriptor = {
    ...descriptor,
    editable: false,
    id: 'read-only',
    loadScope: vi.fn(async () => ({})),
    source: 'export default () => <div>Read-only source</div>;',
  };
  render(<Demo of={readOnlyDescriptor} />);

  expect(screen.getByRole('button', { name: 'Show source' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Copy source' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Open standalone preview' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Enter full screen' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Preview viewport' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Use dark demo theme' })).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Reset source' })).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Show source' }));
  expect(await screen.findByText(/Read-only source/)).toBeTruthy();
  expect(readOnlyDescriptor.loadScope).not.toHaveBeenCalled();
});

it('applies an independent dark canvas and keeps it in standalone URLs', async () => {
  const { container } = render(<Demo of={{ ...descriptor, id: 'dark-canvas' }} />);

  await waitFor(() => expect(document.getElementById('lobe-demo-dark-canvas')).toBeTruthy());

  fireEvent.click(screen.getByRole('button', { name: 'Use dark demo theme' }));

  expect(container.querySelector(`.${styles.viewport}`)?.getAttribute('data-demo-appearance')).toBe(
    'dark',
  );
  expect(
    screen.getByRole('link', { name: 'Open standalone preview' }).getAttribute('href'),
  ).toContain('appearance=dark');
});

it('renders an embedded isolated demo through the standalone route', () => {
  const html = renderToString(<Demo isolated of={{ ...descriptor, id: 'isolated-demo' }} />);

  expect(html).toContain('<iframe');
  expect(html).toContain('/~demos/isolated-demo');
  expect(html).not.toContain('data-demo-placeholder');
});

it('excludes controls, rendered previews, and source while retaining the demo title for search', async () => {
  const { container } = render(
    <Demo of={{ ...descriptor, editable: false }} title="Searchable demo title" />,
  );

  expect(
    screen
      .getByRole('heading', { name: 'Searchable demo title' })
      .closest('[data-pagefind-ignore]'),
  ).toBeNull();
  expect(screen.getByRole('heading', { name: 'Searchable demo title' }).id).toBe(descriptor.id);
  expect(
    screen
      .getByRole('heading', { name: 'Searchable demo title' })
      .closest('section')
      ?.getAttribute('aria-labelledby'),
  ).toBe(descriptor.id);
  expect(
    screen.getByRole('toolbar', { name: 'Demo controls' }).getAttribute('data-pagefind-ignore'),
  ).toBe('all');
  expect(container.querySelector(`.${styles.viewport}`)?.getAttribute('data-pagefind-ignore')).toBe(
    'all',
  );
  await waitFor(() =>
    expect(screen.queryByRole('status', { name: 'Loading demo preview' })).toBeNull(),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Show source' }));
  expect(
    container.querySelector(`.${styles.sourcePanel}`)?.getAttribute('data-pagefind-ignore'),
  ).toBe('all');
});
