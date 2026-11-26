import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ConfigProvider from '@/ConfigProvider';

import Empty from './Empty';

describe('Empty a2ui variant', () => {
  afterEach(cleanup);

  it('renders the inbox icon, title, description and a primary action button', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Empty
        action={{ label: 'Create invoice', onClick }}
        description="Invoices appear here once your first billing cycle closes."
        title="No invoices yet"
        variant="a2ui"
      />,
    );

    expect(container.firstElementChild?.getAttribute('data-variant')).toBe('a2ui');
    expect(container.querySelector('svg')).toBeTruthy();
    expect(screen.getByText('No invoices yet')).toBeTruthy();
    expect(
      screen.getByText('Invoices appear here once your first billing cycle closes.'),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Create invoice' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders an action config as a button in the default variant too', () => {
    render(
      <ConfigProvider motion={motion}>
        <Empty action={{ label: 'Add item' }} title="No items" />
      </ConfigProvider>,
    );

    expect(screen.getByRole('button', { name: 'Add item' })).toBeTruthy();
  });
});
