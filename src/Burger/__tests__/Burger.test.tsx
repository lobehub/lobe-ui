import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';
import type { ListItem } from '@/List';

import Burger from '../Burger';

const items: ListItem[] = [
  { key: 'home', label: 'Home' },
  { key: 'chat', label: 'Chat' },
  { type: 'divider' },
  { key: 'docs', label: 'Docs' },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <ConfigProvider motion={motion}>{children}</ConfigProvider>
);

describe('Burger', () => {
  afterEach(cleanup);

  test('toggle asks to open', () => {
    const onOpenChange = vi.fn();
    render(<Burger items={items} opened={false} onOpenChange={onOpenChange} />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  test('marks the active item and selecting closes', () => {
    const onOpenChange = vi.fn();
    const onSelect = vi.fn();
    render(
      <Burger
        opened
        activeKey="chat"
        items={items}
        onOpenChange={onOpenChange}
        onSelect={onSelect}
      />,
      { wrapper },
    );

    expect(screen.getByRole('button', { name: 'Chat' }).getAttribute('aria-current')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Docs' }));

    expect(onSelect).toHaveBeenCalledWith('docs');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  test('Escape closes', () => {
    const onOpenChange = vi.fn();
    render(<Burger opened items={items} onOpenChange={onOpenChange} />, { wrapper });

    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  test('fullscreen drops dividers and renders the footer', () => {
    render(
      <Burger
        fullscreen
        opened
        footer={<button type="button">Sign in</button>}
        items={items}
        onOpenChange={vi.fn()}
      />,
      { wrapper },
    );

    expect(screen.queryByRole('separator')).toBeNull();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'Close menu' }).length).toBeGreaterThan(0);
  });
});
