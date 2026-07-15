import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { DemoErrorBoundary } from './DemoErrorBoundary';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it('isolates a failed demo and resets only that demo boundary', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  let shouldThrow = true;
  let siblingRenderCount = 0;

  function FailedDemo() {
    if (shouldThrow) throw new Error('Fixture demo failed');
    return <div>Recovered demo</div>;
  }

  function SiblingDemo() {
    siblingRenderCount += 1;
    return <div>Healthy sibling</div>;
  }

  render(
    <>
      <DemoErrorBoundary resetKey="failed">
        <FailedDemo />
      </DemoErrorBoundary>
      <DemoErrorBoundary resetKey="sibling">
        <SiblingDemo />
      </DemoErrorBoundary>
    </>,
  );

  expect(screen.getByRole('alert').textContent).toContain('Fixture demo failed');
  expect(screen.getByText('Healthy sibling')).toBeTruthy();
  const siblingRendersBeforeRetry = siblingRenderCount;

  shouldThrow = false;
  fireEvent.click(screen.getByRole('button', { name: 'Retry demo' }));

  expect(screen.getByText('Recovered demo')).toBeTruthy();
  expect(screen.getByText('Healthy sibling')).toBeTruthy();
  expect(siblingRenderCount).toBe(siblingRendersBeforeRetry);
});
