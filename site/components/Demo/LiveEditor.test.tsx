import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentType } from 'react';

import type { DemoModule } from '../../types/demo';
import LiveEditor from './LiveEditor';

vi.mock('react-live', async () => {
  const React = await import('react');

  return {
    Editor: ({ code, onChange }: { code: string; onChange?: (value: string) => void }) => (
      <textarea value={code} onChange={(event) => onChange?.(event.currentTarget.value)} />
    ),
    renderElementAsync: (
      { code }: { code: string },
      onResult: (component: ComponentType) => void,
      onError: (error: Error) => void,
    ) => {
      if (code.includes('RUNTIME_FAILURE')) {
        onError(new Error('Runtime compilation failed'));
        return;
      }

      const label = code.includes('Second') ? 'Edited result: Second' : 'Edited result: Original';
      onResult(() => React.createElement('div', null, label));
    },
  };
});

const source = `import { useState } from 'react';

export default function Example() {
  const [label] = useState('Original');
  return <div>{label}</div>;
}`;

const createDescriptor = (loadScope = vi.fn(async () => ({ useState: vi.fn() }))): DemoModule => ({
  editable: true,
  id: 'live-editor',
  legacyIds: ['legacy-live-editor'],
  load: async () => () => null,
  loadScope,
  routeId: 'components/LiveEditor/index',
  source,
  sourcePath: 'src/LiveEditor/demos/index.tsx',
});

const getEditor = (): HTMLTextAreaElement => {
  const wrapper = screen.getByRole('textbox', { name: 'Demo source editor' });
  const editor = wrapper.querySelector('textarea');
  if (!editor) throw new Error('Expected the react-live editor fixture');
  return editor;
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

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

it('loads scope on mount while keeping imports outside the editable surface', async () => {
  const loadScope = vi.fn(async () => ({ useState: vi.fn() }));
  render(<LiveEditor appearance="dark" demo={createDescriptor(loadScope)} resetSignal={0} />);

  expect(await screen.findByText('Edited result: Original')).toBeTruthy();
  expect(loadScope).toHaveBeenCalledTimes(1);
  expect(screen.getByLabelText('Read-only imports').textContent).toContain("from 'react'");
  expect(getEditor().value).not.toContain("from 'react'");
  expect(document.getElementById('lobe-demo-live-editor-live')).toBeTruthy();
});

it('retains the last successful element when a subsequent compile fails', async () => {
  render(<LiveEditor appearance="light" demo={createDescriptor()} resetSignal={0} />);
  await screen.findByRole('textbox', { name: 'Demo source editor' });
  const editor = getEditor();

  fireEvent.change(editor, {
    target: {
      value: `export default function Example() { return <div>Second</div>; }`,
    },
  });
  expect(await screen.findByText('Edited result: Second')).toBeTruthy();

  fireEvent.change(editor, {
    target: { value: 'export default function RUNTIME_FAILURE() {}' },
  });

  expect((await screen.findByRole('alert')).textContent).toContain('Runtime compilation failed');
  expect(screen.getByText('Edited result: Second')).toBeTruthy();
});

it('resets the editor to repository source without reloading scope', async () => {
  const loadScope = vi.fn(async () => ({ useState: vi.fn() }));
  const descriptor = createDescriptor(loadScope);
  const { rerender } = render(<LiveEditor appearance="light" demo={descriptor} resetSignal={0} />);
  await screen.findByRole('textbox', { name: 'Demo source editor' });
  const editor = getEditor();
  fireEvent.change(editor, {
    target: { value: 'export default () => <div>Second</div>;' },
  });

  rerender(<LiveEditor appearance="light" demo={descriptor} resetSignal={1} />);

  await waitFor(() => {
    expect(getEditor().value).toContain("useState('Original')");
  });
  expect(loadScope).toHaveBeenCalledTimes(1);
});
