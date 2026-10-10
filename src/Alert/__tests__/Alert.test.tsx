import { fireEvent, render, screen } from '@testing-library/react';

import Alert from '../Alert';

describe('Alert', () => {
  test('exposes alert semantics and renders each content region', () => {
    render(
      <Alert
        action={<button type="button">Retry</button>}
        description="The connection could not be established."
        title="Connection failed"
        type="warning"
        variant="outlined"
      />,
    );

    const alert = screen.getByRole('alert');

    expect(alert.dataset.alertType).toBe('warning');
    expect(alert.dataset.alertVariant).toBe('outlined');
    expect(screen.getByText('Connection failed')).toBeTruthy();
    expect(screen.getByText('The connection could not be established.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
  });

  test('retains the message alias and forwards the native root ref', () => {
    let root: HTMLDivElement | null = null;

    render(
      <Alert
        message="Legacy message"
        ref={(node) => {
          root = node;
        }}
      />,
    );

    expect(screen.getByText('Legacy message')).toBeTruthy();
    expect(root).toBe(screen.getByRole('alert'));
  });

  test('dismisses through the close configuration and reports both lifecycle callbacks', () => {
    const afterClose = vi.fn();
    const onClose = vi.fn();

    render(
      <Alert
        title="Connection warning"
        closable={{
          'aria-label': 'Dismiss connection warning',
          afterClose,
          onClose,
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss connection warning' }));

    expect(screen.queryByRole('alert')).toBeNull();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(afterClose).toHaveBeenCalledTimes(1);
  });

  test('keeps the alert visible when its close affordance is disabled', () => {
    render(<Alert closable={{ disabled: true }} title="Persistent warning" />);

    fireEvent.click(screen.getByRole('button', { name: 'Close alert' }));

    expect(screen.getByRole('alert')).toBeTruthy();
  });

  test('reveals integrated details through an accessible disclosure', () => {
    render(<Alert extra={<pre>ECONNREFUSED 127.0.0.1</pre>} title="Request failed" />);

    const detailRegion = screen
      .getByText('ECONNREFUSED 127.0.0.1')
      .closest<HTMLDetailsElement>('details');

    expect(detailRegion?.open).toBe(false);

    fireEvent.click(screen.getByText('Show Details').closest('summary')!);

    expect(detailRegion?.open).toBe(true);
  });
});
