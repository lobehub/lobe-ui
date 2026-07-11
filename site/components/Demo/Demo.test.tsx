import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentType } from 'react';
import { renderToString } from 'react-dom/server';

import type { DemoModule } from '../../types/demo';
import Demo from './Demo';

vi.mock('react-live', () => ({
  Editor: ({ code, onChange }: { code: string; onChange?: (value: string) => void }) => (
    <textarea value={code} onChange={(event) => onChange?.(event.currentTarget.value)} />
  ),
  renderElementAsync: ({ code }: { code: string }, onResult: (component: ComponentType) => void) =>
    onResult(() => (
      <div>
        {code.includes('Persisted edit') ? 'Persisted edit result' : 'Edited preview result'}
      </div>
    )),
}));

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

it('keeps canonical preview visible beside the expanded edited preview', async () => {
  const canonicalDescriptor: DemoModule = {
    ...descriptor,
    id: 'dual-preview',
    load: async () => () => <div>Canonical result</div>,
    source: 'export default () => <div>Edited result</div>;',
  };
  render(<Demo of={canonicalDescriptor} />);

  expect(await screen.findByText('Canonical result')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Show source editor' }));

  expect(await screen.findByLabelText('Edited demo preview')).toBeTruthy();
  expect(screen.getByText('Canonical result')).toBeTruthy();
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
  const wrapper = await screen.findByRole('textbox', { name: 'Demo source editor' });
  const textarea = wrapper.querySelector('textarea');
  if (!textarea) throw new Error('Expected the react-live editor fixture');
  fireEvent.change(textarea, {
    target: { value: 'export default () => <div>Persisted edit</div>;' },
  });
  expect(await screen.findByText('Persisted edit result')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'Hide source editor' }));
  expect(screen.queryByRole('textbox', { name: 'Demo source editor' })).toBeNull();
  expect(
    screen.getByText('Persisted edit result').closest<HTMLElement>('.demo-frame__source-panel')
      ?.hidden,
  ).toBe(true);

  fireEvent.click(screen.getByRole('button', { name: 'Show source editor' }));
  const reopened = await screen.findByRole('textbox', { name: 'Demo source editor' });
  expect((reopened.querySelector('textarea') as HTMLTextAreaElement | null)?.value).toContain(
    'Persisted edit',
  );
  expect(await screen.findByText('Persisted edit result')).toBeTruthy();
  expect(loadScope).toHaveBeenCalledTimes(1);
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
  expect(screen.getByRole('combobox', { name: 'Preview viewport' })).toBeTruthy();
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

  expect(
    container.querySelector('.demo-frame__viewport')?.getAttribute('data-demo-appearance'),
  ).toBe('dark');
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
