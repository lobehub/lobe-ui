import { render, screen } from '@testing-library/react';

import Button from '@/Button';

import Alert from './Alert';

describe('Alert', () => {
  test('anchors the action and close control to the title line box', () => {
    render(
      <Alert
        closable
        action={<Button size={'small'}>Regenerate</Button>}
        title={'Provider connection failed during the final response'}
      />,
    );

    const alert = screen.getByRole('alert');
    const actions = getComputedStyle(alert.querySelector('.ant-alert-actions')!);
    expect(actions.alignSelf).toBe('flex-start');
    expect(actions.height).toBe('24px');
    expect(actions.alignItems).toBe('center');
    const close = getComputedStyle(alert.querySelector('.ant-alert-close-icon')!);
    expect(close.alignSelf).toBe('flex-start');
    expect(close.height).toBe('24px');
  });

  test('keeps the icon on the first line of a wrapping message-only alert', () => {
    render(
      <Alert
        title={
          <div>
            <p>The workspace will be permanently deleted, along with:</p>
            <ul>
              <li>All agents, skills, and their configurations</li>
              <li>All messages, topics, and tasks</li>
            </ul>
          </div>
        }
      />,
    );

    const icon = getComputedStyle(screen.getByRole('alert').querySelector('.ant-alert-icon')!);
    expect(icon.alignSelf).toBe('flex-start');
    expect(icon.height).toBe('24px');
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
