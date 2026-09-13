import { cleanup, render, screen } from '@testing-library/react';

import Result from '../Result';

describe('Result', () => {
  afterEach(cleanup);

  test('renders info status by default', () => {
    const { container } = render(<Result title="Title" />);

    expect(container.querySelector('svg')).toBeTruthy();
  });

  test.each(['success', 'error', 'warning', 'info'] as const)(
    'renders the %s status icon',
    (status) => {
      const { container } = render(<Result status={status} title={status} />);

      expect(container.querySelector('svg')).toBeTruthy();
      expect(screen.getByText(status)).toBeTruthy();
    },
  );

  test('overrides the default icon with a custom icon', () => {
    render(<Result icon={<span data-testid="custom-icon" />} status="success" />);

    expect(screen.getByTestId('custom-icon')).toBeTruthy();
  });

  test('renders title, subTitle, extra, and children', () => {
    render(
      <Result
        extra={<button type="button">Retry</button>}
        subTitle="Something went wrong"
        title="Error"
      >
        <div>Details</div>
      </Result>,
    );

    expect(screen.getByText('Error')).toBeTruthy();
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('Retry')).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
  });

  test('omits title, subTitle, and extra when not provided', () => {
    const { container } = render(<Result />);

    expect(container.querySelector('h3')).toBeNull();
    expect(container.querySelector('p')).toBeNull();
  });

  test('forwards className and style to the root section', () => {
    const { container } = render(<Result className="custom" style={{ marginTop: 4 }} />);

    const root = container.querySelector('section');
    expect(root?.className).toContain('custom');
    expect(root?.getAttribute('style')).toContain('margin-top');
  });

  test('sets the displayName', () => {
    expect(Result.displayName).toBe('Result');
  });
});
