import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { motion } from 'motion/react';
import { type ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Avatar from '../Avatar';
import AvatarGroup from '../AvatarGroup';
import { styles } from '../style';

const renderWithProvider = (children: ReactNode) =>
  render(<ConfigProvider motion={motion}>{children}</ConfigProvider>);

describe('Avatar', () => {
  afterEach(cleanup);

  test('renders sliced uppercase fallback text', () => {
    const { container } = renderWithProvider(<Avatar avatar="lobehub" />);

    expect(screen.getByText('LO')).toBeTruthy();
    expect((container.firstChild as HTMLElement).style.fontSize).toBe('24px');
  });

  test('keeps the full text when sliceText is false', () => {
    renderWithProvider(<Avatar avatar="chat" sliceText={false} />);

    expect(screen.getByText('CHAT')).toBeTruthy();
  });

  test('uses title as fallback text for image avatars', () => {
    renderWithProvider(<Avatar avatar="/lobe.png" title="LB" />);

    expect(screen.getByRole('img', { name: 'LB' })).toBeTruthy();
    expect(screen.queryByText('LB')).toBeNull();
  });

  test('falls back to text when the image fails to load', async () => {
    renderWithProvider(<Avatar avatar="/broken.png" title="LB" />);

    fireEvent.error(screen.getByRole('img', { name: 'LB' }));

    await waitFor(() => expect(screen.getByText('LB')).toBeTruthy());
  });

  test('resolves emoji through FluentEmoji', () => {
    renderWithProvider(<Avatar avatar="😀" />);

    expect(screen.getByRole('img', { name: '😀' })).toBeTruthy();
  });

  test('renders a custom React node avatar as-is', () => {
    renderWithProvider(<Avatar avatar={<span>custom</span>} />);

    expect(screen.getByText('custom')).toBeTruthy();
  });

  test('shows the loading overlay while loading', () => {
    const { container } = renderWithProvider(<Avatar loading avatar="X" />);

    expect(container.querySelector(`.${styles.loading}`)).toBeTruthy();
    expect(container.querySelector('svg')).toBeTruthy();
  });

  test('applies circle radius and bordered ring', () => {
    const { container } = renderWithProvider(<Avatar bordered avatar="A" shape="circle" />);
    const root = container.firstChild as HTMLElement;

    expect(root.style.borderRadius).toBe('50%');
    expect(root.style.boxShadow).toContain('0 0 0 2px');
    expect(root.style.boxShadow).toContain('0 0 0 4px');
  });

  test('applies a small square radius below 24px', () => {
    const { container } = renderWithProvider(<Avatar avatar="A" size={20} />);

    expect((container.firstChild as HTMLElement).style.borderRadius).toBe('33%');
  });

  test('shows a pointer cursor when clickable', () => {
    const onClick = vi.fn();
    const { container } = renderWithProvider(<Avatar avatar="A" onClick={onClick} />);
    const root = container.firstChild as HTMLElement;

    expect(root.style.cursor).toBe('pointer');

    fireEvent.click(root);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('AvatarGroup', () => {
  const items = [
    { avatar: 'Lo', key: 'a' },
    { avatar: 'Ch', key: 'b' },
    { avatar: 'Ai', key: 'c' },
    { avatar: 'Ag', key: 'd' },
    { avatar: 'Ui', key: 'e' },
  ];

  afterEach(cleanup);

  test('renders every item without max', () => {
    renderWithProvider(<AvatarGroup items={items} />);

    expect(screen.getByText('LO')).toBeTruthy();
    expect(screen.getByText('UI')).toBeTruthy();
    expect(screen.queryByText('+2')).toBeNull();
  });

  test('slices items to max and shows the count', () => {
    renderWithProvider(<AvatarGroup items={items} max={3} />);

    expect(screen.getByText('LO')).toBeTruthy();
    expect(screen.getByText('CH')).toBeTruthy();
    expect(screen.getByText('AI')).toBeTruthy();
    expect(screen.queryByText('AG')).toBeNull();
    expect(screen.getByText('+2')).toBeTruthy();
  });

  test('reports clicks with item and key', () => {
    const onClick = vi.fn();

    renderWithProvider(<AvatarGroup items={items.slice(0, 1)} onClick={onClick} />);

    fireEvent.click(screen.getByText('LO'));

    expect(onClick).toHaveBeenCalledWith({ item: items[0], key: 'a' });
  });

  test('reverses stacking order with zIndexReverse', () => {
    const { container } = renderWithProvider(<AvatarGroup zIndexReverse items={items} size={48} />);
    const avatars = (container.firstChild as HTMLElement).children;

    expect(avatars.length).toBe(items.length);
    expect((avatars[0] as HTMLElement).style.zIndex).toBe(String(items.length));
    expect((avatars[1] as HTMLElement).style.zIndex).toBe(String(items.length - 1));
  });
});
