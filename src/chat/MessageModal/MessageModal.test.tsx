import { fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import { MotionProvider } from '@/MotionProvider';

import MessageModal from './MessageModal';

beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  );
});

it('opens on base-ui Modal and switches to editing through the ok button', async () => {
  render(
    <MotionProvider motion={motion}>
      <MessageModal open text={{ edit: 'Edit', title: 'Message' }} value="hello" />
    </MotionProvider>,
  );

  expect(await screen.findByText('Message')).toBeTruthy();
  expect(screen.getByText('hello')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

  expect(screen.getByRole('button', { name: 'Confirm' })).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull();
});
