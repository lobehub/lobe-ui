import { render, screen } from '@testing-library/react';

import Button from '@/Button';

import Alert from './Alert';

describe('Alert', () => {
  test('centers single-line content with its action and close control', () => {
    render(
      <Alert
        closable
        action={<Button size={'small'}>Regenerate</Button>}
        title={'Provider connection failed during the final response'}
      />,
    );

    expect(getComputedStyle(screen.getByRole('alert')).alignItems).toBe('center');
  });

  test('keeps multi-line content top-aligned', () => {
    render(
      <Alert
        action={<Button size={'small'}>Review</Button>}
        description={'The provider rejected the request.'}
        title={'Connection failed'}
      />,
    );

    expect(getComputedStyle(screen.getByRole('alert')).alignItems).toBe('flex-start');
  });
});
