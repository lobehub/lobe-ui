import { render, waitFor } from '@testing-library/react';

const runtime = vi.hoisted(() => ({
  construct: vi.fn(),
  dispose: vi.fn(),
  evaluated: vi.fn(),
  load: vi.fn(async () => {}),
}));

vi.mock('@splinetool/runtime', () => {
  runtime.evaluated();
  class Application {
    constructor(...args: unknown[]) {
      runtime.construct(...args);
    }
    addEventListener = vi.fn();
    dispose = runtime.dispose;
    load = runtime.load;
    removeEventListener = vi.fn();
  }
  return { Application };
});

class ResizeObserverStub {
  disconnect() {}
  observe() {}
  unobserve() {}
}

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverStub);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

it('loads the Spline runtime only when the component renders', async () => {
  const { default: Spline } = await import('./index');
  expect(runtime.evaluated).not.toHaveBeenCalled();

  const { unmount } = render(<Spline scene="https://example.com/scene.splinecode" />);

  await waitFor(() =>
    expect(runtime.load).toHaveBeenCalledWith('https://example.com/scene.splinecode'),
  );
  expect(runtime.evaluated).toHaveBeenCalledTimes(1);
  expect(runtime.construct.mock.calls[0][1]).toEqual({ renderOnDemand: true });

  unmount();
  expect(runtime.dispose).toHaveBeenCalledTimes(1);
});

it('does not create the runtime when it unmounts before the import resolves', async () => {
  runtime.construct.mockClear();
  const { default: Spline } = await import('./index');
  const { unmount } = render(<Spline scene="https://example.com/other.splinecode" />);
  unmount();
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(runtime.construct).not.toHaveBeenCalled();
});
