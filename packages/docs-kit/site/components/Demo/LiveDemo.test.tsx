import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentType } from 'react';

import type { DemoAppearance, DemoModule } from '../../types/demo';
import { LiveDemo } from './LiveDemo';
import { styles } from './style';

interface HarnessProps {
  appearance: DemoAppearance;
  demo: DemoModule;
  resetSignal: number;
}

const Harness = (props: HarnessProps) => (
  <LiveDemo expanded sourcePanelId="live-demo-source" viewport="responsive" {...props} />
);

const liveMocks = vi.hoisted(() => ({
  activeFailureTrigger: undefined as (() => void) | undefined,
  activeShouldThrow: false,
  deferredErrors: [] as (() => void)[],
  deferredResults: [] as (() => void)[],
}));

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
      if (code.includes('TOP_LEVEL_FAILURE')) {
        throw new Error('Top-level evaluation failed');
      }
      if (code.includes('RUNTIME_FAILURE')) {
        onError(new Error('Runtime compilation failed'));
        return;
      }
      if (code.includes('DEFERRED_ERROR')) {
        liveMocks.deferredErrors.push(() => onError(new Error('Obsolete runtime failure')));
        return;
      }
      if (code.includes('DEFERRED_RESULT')) {
        liveMocks.deferredResults.push(() =>
          onResult(() => React.createElement('div', null, 'Edited result: Obsolete')),
        );
        return;
      }

      const label = code.includes('Second')
        ? 'Edited result: Second'
        : code.includes('Replacement')
          ? 'Edited result: Replacement'
          : 'Edited result: Original';
      const Candidate = () => {
        const [count, setCount] = React.useState(0);
        React.useEffect(() => {
          if (!code.includes('ACTIVE_LATE_FAILURE')) return;
          liveMocks.activeFailureTrigger = () => {
            liveMocks.activeShouldThrow = true;
            setCount((value) => value + 1);
          };
          return () => {
            liveMocks.activeFailureTrigger = undefined;
          };
        }, []);
        if (code.includes('ACTIVE_LATE_FAILURE') && liveMocks.activeShouldThrow) {
          throw new Error('Active candidate failed');
        }
        if (code.includes('RENDER_FAILURE')) throw new Error('Candidate render failed');
        if (code.includes('STATEFUL_ORIGINAL')) {
          return React.createElement(
            'button',
            { onClick: () => setCount((value) => value + 1) },
            `Original count ${count}`,
          );
        }
        return React.createElement('div', null, label);
      };
      class MockLiveBoundary extends React.Component<
        { children?: ReturnType<typeof React.createElement> },
        { failed: boolean }
      > {
        state = { failed: false };

        static getDerivedStateFromError() {
          return { failed: true };
        }

        componentDidCatch(error: Error) {
          onError(error);
        }

        render() {
          return this.state.failed ? null : (this.props.children ?? null);
        }
      }
      onResult(() => React.createElement(MockLiveBoundary, null, React.createElement(Candidate)));
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
  routeId: 'components/LiveDemo/index',
  source,
  sourcePath: 'src/LiveDemo/demos/index.tsx',
});

const getEditor = (): HTMLTextAreaElement => {
  const editor = screen.getByRole('textbox', { name: 'Demo source editor' });
  if (!(editor instanceof HTMLTextAreaElement)) {
    throw new TypeError('Expected the react-live editor fixture');
  }
  return editor;
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  liveMocks.activeFailureTrigger = undefined;
  liveMocks.activeShouldThrow = false;
  liveMocks.deferredErrors.length = 0;
  liveMocks.deferredResults.length = 0;
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

it('loads scope while containing each promoted preview and its portal host in one slot', async () => {
  const loadScope = vi.fn(async () => ({ useState: vi.fn() }));
  const { container } = render(
    <Harness appearance="dark" demo={createDescriptor(loadScope)} resetSignal={0} />,
  );

  expect(await screen.findByText('Edited result: Original')).toBeTruthy();
  expect(
    container
      .querySelector(`.${styles.sourcePanel} [data-pagefind-ignore]`)
      ?.getAttribute('data-pagefind-ignore'),
  ).toBe('all');
  expect(loadScope).toHaveBeenCalledTimes(1);
  expect(screen.getByLabelText('Read-only imports').textContent).toContain("from 'react'");
  expect(getEditor().value).not.toContain("from 'react'");
  const stage = container.querySelector(`.${styles.liveStage}`);
  const active = stage?.querySelector<HTMLElement>('[data-live-state="active"]');
  expect(stage).toBeTruthy();
  expect(active?.hasAttribute('hidden')).toBe(false);
  expect(active?.querySelector('[id^="lobe-demo-live-editor-live-"]')).toBeTruthy();
  expect(active?.querySelector('[data-lobe-portal-host]')).toBeTruthy();
});

it('retains the last successful element when a subsequent compile fails', async () => {
  render(<Harness appearance="light" demo={createDescriptor()} resetSignal={0} />);
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

it('retains the last successful element when top-level evaluation throws synchronously', async () => {
  render(<Harness appearance="light" demo={createDescriptor()} resetSignal={0} />);
  expect(await screen.findByText('Edited result: Original')).toBeTruthy();

  fireEvent.change(getEditor(), {
    target: { value: 'export default function TOP_LEVEL_FAILURE() {}' },
  });

  expect((await screen.findByRole('alert')).textContent).toContain('Top-level evaluation failed');
  expect(screen.getByText('Edited result: Original')).toBeTruthy();
});

it('promotes a candidate only after its React render commits successfully', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  render(<Harness appearance="light" demo={createDescriptor()} resetSignal={0} />);
  expect(await screen.findByText('Edited result: Original')).toBeTruthy();

  fireEvent.change(getEditor(), {
    target: {
      value: 'export default function RENDER_FAILURE() { return <div>Replacement</div>; }',
    },
  });

  expect((await screen.findByRole('alert')).textContent).toContain('Candidate render failed');
  expect(screen.getByText('Edited result: Original')).toBeTruthy();
  expect(screen.queryByText('Edited result: Replacement')).toBeNull();
  consoleError.mockRestore();
});

it('ignores obsolete evaluator result and error callbacks after a newer generation commits', async () => {
  render(<Harness appearance="light" demo={createDescriptor()} resetSignal={0} />);
  expect(await screen.findByText('Edited result: Original')).toBeTruthy();

  fireEvent.change(getEditor(), {
    target: { value: 'export default function DEFERRED_RESULT() { return null; }' },
  });
  expect(liveMocks.deferredResults).toHaveLength(1);
  fireEvent.change(getEditor(), {
    target: { value: 'export default function DEFERRED_ERROR() { return null; }' },
  });
  expect(liveMocks.deferredErrors).toHaveLength(1);
  fireEvent.change(getEditor(), {
    target: { value: 'export default function Second() { return <div>Second</div>; }' },
  });
  expect(await screen.findByText('Edited result: Second')).toBeTruthy();

  liveMocks.deferredResults[0]();
  liveMocks.deferredErrors[0]();
  await waitFor(() => expect(screen.queryByText('Edited result: Obsolete')).toBeNull());
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.getByText('Edited result: Second')).toBeTruthy();
});

it('reports a still-active generation failure and restores the previous successful preview', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  const { container } = render(
    <Harness appearance="light" demo={createDescriptor()} resetSignal={0} />,
  );
  expect(await screen.findByText('Edited result: Original')).toBeTruthy();

  fireEvent.change(getEditor(), {
    target: {
      value: 'export default function ACTIVE_LATE_FAILURE() { return <div>Second</div>; }',
    },
  });
  await waitFor(() =>
    expect(container.querySelector('[data-live-state="active"]')?.textContent).toContain('Second'),
  );
  expect(liveMocks.activeFailureTrigger).toBeTypeOf('function');

  fireEvent.change(getEditor(), {
    target: { value: 'export default function RUNTIME_FAILURE() {}' },
  });
  expect((await screen.findByRole('alert')).textContent).toContain('Runtime compilation failed');

  act(() => liveMocks.activeFailureTrigger?.());

  await waitFor(() =>
    expect(screen.getByRole('alert').textContent).toContain('Active candidate failed'),
  );
  expect(container.querySelector('[data-live-state="active"]')?.textContent).toContain('Original');
  expect(container.querySelector('[data-live-state="active"]')?.textContent).not.toContain(
    'Second',
  );
  consoleError.mockRestore();
});

it('restores the previous preview without resetting its local state', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  const statefulDescriptor: DemoModule = {
    ...createDescriptor(),
    source: 'export default function STATEFUL_ORIGINAL() { return <button>Original</button>; }',
  };
  const { container } = render(
    <Harness appearance="light" demo={statefulDescriptor} resetSignal={0} />,
  );
  const original = await screen.findByRole('button', { name: 'Original count 0' });

  fireEvent.click(original);
  expect(screen.getByRole('button', { name: 'Original count 1' })).toBeTruthy();

  fireEvent.change(getEditor(), {
    target: {
      value: 'export default function ACTIVE_LATE_FAILURE() { return <div>Second</div>; }',
    },
  });
  await waitFor(() =>
    expect(container.querySelector('[data-live-state="active"]')?.textContent).toContain('Second'),
  );
  expect(liveMocks.activeFailureTrigger).toBeTypeOf('function');

  act(() => liveMocks.activeFailureTrigger?.());

  await waitFor(() =>
    expect(container.querySelector('[data-live-state="active"]')?.textContent).toContain(
      'Original count 1',
    ),
  );
  consoleError.mockRestore();
});

it('reports scope failure without leaving a perpetual loading status', async () => {
  const loadScope = vi.fn(async () => {
    throw new Error('Dependency unavailable');
  });
  render(<Harness appearance="light" demo={createDescriptor(loadScope)} resetSignal={0} />);

  expect((await screen.findByRole('alert')).textContent).toContain('Dependency unavailable');
  expect(screen.queryByText('Loading editable dependencies…')).toBeNull();
});

it('reports a syntax error on visible editor line one as line one', async () => {
  render(<Harness appearance="light" demo={createDescriptor()} resetSignal={0} />);
  await screen.findByText('Edited result: Original');

  fireEvent.change(getEditor(), {
    target: { value: 'export default () => <div>;' },
  });

  expect((await screen.findByRole('alert')).textContent).toMatch(/^Line 1,/);
  expect(screen.getByText('Edited result: Original')).toBeTruthy();
});

it('replaces the source revision atomically and never retains a stale preview after scope failure', async () => {
  const initial = createDescriptor();
  const replacementScope = vi.fn(async () => {
    throw new Error('Replacement scope failed');
  });
  const replacement: DemoModule = {
    ...createDescriptor(replacementScope),
    id: 'replacement-editor',
    source: 'export default function Replacement() { return <div>Replacement</div>; }',
    sourcePath: 'src/Replacement/demos/index.tsx',
  };
  const { rerender } = render(<Harness appearance="light" demo={initial} resetSignal={0} />);
  expect(await screen.findByText('Edited result: Original')).toBeTruthy();

  rerender(<Harness appearance="light" demo={replacement} resetSignal={0} />);

  expect((await screen.findByRole('alert')).textContent).toContain('Replacement scope failed');
  expect(screen.queryByText('Edited result: Original')).toBeNull();
  expect(getEditor().value).toContain('function Replacement');
  expect(replacementScope).toHaveBeenCalledTimes(1);
});

it('resets the editor to repository source without reloading scope', async () => {
  const loadScope = vi.fn(async () => ({ useState: vi.fn() }));
  const descriptor = createDescriptor(loadScope);
  const { rerender } = render(<Harness appearance="light" demo={descriptor} resetSignal={0} />);
  await screen.findByRole('textbox', { name: 'Demo source editor' });
  const editor = getEditor();
  fireEvent.change(editor, {
    target: { value: 'export default () => <div>Second</div>;' },
  });

  rerender(<Harness appearance="light" demo={descriptor} resetSignal={1} />);

  await waitFor(() => {
    expect(getEditor().value).toContain("useState('Original')");
  });
  expect(loadScope).toHaveBeenCalledTimes(1);
});
