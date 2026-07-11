import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';

import type { DemoModule } from '../../types/demo';
import CanonicalPreview from './CanonicalPreview';

const createDescriptor = (load: DemoModule['load'], id = 'hook-demo'): DemoModule => ({
  editable: true,
  id,
  legacyIds: [],
  load,
  loadScope: async () => ({}),
  routeId: 'components/HookDemo/index',
  source: 'export default function Demo() { return <div />; }',
  sourcePath: 'src/HookDemo/demos/index.tsx',
});

beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    })),
  );
});

afterAll(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it('renders a deterministic placeholder without loading the demo during SSR', () => {
  const load = vi.fn<DemoModule['load']>();
  const descriptor = createDescriptor(load);

  const firstHtml = renderToString(<CanonicalPreview demo={descriptor} />);
  const secondHtml = renderToString(<CanonicalPreview demo={descriptor} />);

  expect(firstHtml).toBe(secondHtml);
  expect(firstHtml).toContain('data-demo-placeholder');
  expect(load).not.toHaveBeenCalled();
});

it('renders the Vite-loaded default as a component after hydration', async () => {
  function HookDemo() {
    const [label] = useState('Hook-bearing canonical demo');
    return <div>{label}</div>;
  }

  const descriptor = createDescriptor(vi.fn(async () => HookDemo));
  render(<CanonicalPreview appearance="dark" demo={descriptor} />);

  expect(await screen.findByText('Hook-bearing canonical demo')).toBeTruthy();
  expect(document.getElementById('lobe-demo-hook-demo')).toBeTruthy();
  expect(descriptor.load).toHaveBeenCalledTimes(1);
});

it('retries only the rejected canonical demo load', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  function RecoveredDemo() {
    return <div>Recovered canonical demo</div>;
  }
  function HealthyDemo() {
    return <div>Healthy canonical sibling</div>;
  }

  let attempts = 0;
  const failedLoad = vi.fn(async () => {
    attempts += 1;
    if (attempts === 1) throw new Error('Canonical load failed');
    return RecoveredDemo;
  });
  const healthyLoad = vi.fn(async () => HealthyDemo);

  render(
    <>
      <CanonicalPreview demo={createDescriptor(failedLoad, 'failed-demo')} />
      <CanonicalPreview demo={createDescriptor(healthyLoad, 'healthy-demo')} />
    </>,
  );

  expect(await screen.findByText('Healthy canonical sibling')).toBeTruthy();
  expect(await screen.findByRole('alert')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Retry demo' }));

  expect(await screen.findByText('Recovered canonical demo')).toBeTruthy();
  expect(failedLoad).toHaveBeenCalledTimes(2);
  expect(healthyLoad).toHaveBeenCalledTimes(1);
});

it('contains a component that throws during canonical rendering', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  function ThrowingDemo(): never {
    throw new Error('Throwing demo fixture');
  }

  render(<CanonicalPreview demo={createDescriptor(async () => ThrowingDemo, 'throws')} />);

  expect(await screen.findByRole('alert')).toBeTruthy();
  expect(screen.getByText('Throwing demo fixture')).toBeTruthy();
});
