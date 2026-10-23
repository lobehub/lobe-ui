import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { motion } from 'motion/react';
import { type ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Avatar from '../Avatar';
import AvatarGroup from '../AvatarGroup';

const renderWithProvider = (children: ReactNode) =>
  render(<ConfigProvider motion={motion}>{children}</ConfigProvider>);

describe('Avatar', () => {
  afterEach(cleanup);

  test('renders sliced uppercase text avatars', () => {
    const { container } = renderWithProvider(<Avatar avatar="lobehub" />);

    expect(screen.getByText('LO')).toBeTruthy();
    expect(getComputedStyle(container.firstChild as HTMLElement).fontSize).toBe('24px');
  });

  test('renders empty text when avatar and title are missing', () => {
    const { container } = renderWithProvider(<Avatar />);

    expect(container.textContent).toBe('');
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

  test('falls back to the generated avatar when the image fails to load', async () => {
    const { container } = renderWithProvider(<Avatar avatar="/broken.png" title="LB" />);

    fireEvent.error(screen.getByRole('img', { name: 'LB' }));

    await waitFor(() => expect(container.querySelector('svg.lobe-avatar__fallback')).toBeTruthy());
    expect(screen.queryByText('LB')).toBeNull();
  });

  test('falls back to text when the image fails and fallbackVariant is text', async () => {
    renderWithProvider(<Avatar avatar="/broken.png" fallbackVariant="text" title="LB" />);

    fireEvent.error(screen.getByRole('img', { name: 'LB' }));

    await waitFor(() => expect(screen.getByText('LB')).toBeTruthy());
  });

  test('renders a marble fallback seeded by title by default', () => {
    const { container } = renderWithProvider(<Avatar title="LobeHub" />);
    const svg = container.querySelector<SVGElement>('svg.lobe-avatar__fallback');

    expect(svg).toBeTruthy();
    expect(svg!.getAttribute('aria-label')).toBe('LobeHub');
    expect(svg!.getAttribute('width')).toBe('100%');
    expect(screen.queryByText('LO')).toBeNull();
  });

  test('is deterministic for the same seed and differs between seeds', () => {
    const render1 = renderWithProvider(<Avatar fallbackVariant="beam" title="Arvin" />);
    const a = render1.container.querySelector('svg')!.innerHTML;
    cleanup();
    const render2 = renderWithProvider(<Avatar fallbackVariant="beam" title="Arvin" />);
    const b = render2.container.querySelector('svg')!.innerHTML;
    cleanup();
    const render3 = renderWithProvider(<Avatar fallbackVariant="beam" title="Canis" />);
    const c = render3.container.querySelector('svg')!.innerHTML;

    const strip = (html: string) => html.replaceAll(/_r_[\w]+_|:r[\w]+:|«r[\w]+»/g, '');
    expect(strip(a)).toBe(strip(b));
    expect(strip(a)).not.toBe(strip(c));
  });

  test.each(['marble', 'beam', 'pixel', 'sunset', 'ring', 'bauhaus'] as const)(
    'renders the %s fallback variant',
    (variant) => {
      const { container } = renderWithProvider(<Avatar fallbackVariant={variant} title="Lobe" />);

      expect(container.querySelector('svg.lobe-avatar__fallback')).toBeTruthy();
    },
  );

  test('uses custom fallbackColors', () => {
    const { container } = renderWithProvider(
      <Avatar fallbackColors={['#123456']} fallbackVariant="pixel" title="Lobe" />,
    );

    expect(container.querySelector('svg')!.innerHTML.toLowerCase()).toContain('#123456');
  });

  test('keeps initials when fallbackVariant is text', () => {
    renderWithProvider(<Avatar fallbackVariant="text" title="lobehub" />);

    expect(screen.getByText('LO')).toBeTruthy();
  });

  test('never replaces explicit text or emoji avatars', () => {
    const { container } = renderWithProvider(
      <>
        <Avatar avatar="AB" title="Something" />
        <Avatar avatar="😀" title="Something" />
      </>,
    );

    expect(screen.getByText('AB')).toBeTruthy();
    expect(container.querySelector('svg.lobe-avatar__fallback')).toBeNull();
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
    const { container } = renderWithProvider(
      <Avatar loading avatar="X" classNames={{ loading: 'avatar-loading' }} />,
    );

    const overlay = container.querySelector<HTMLElement>('.avatar-loading');
    expect(overlay).toBeTruthy();
    expect(getComputedStyle(overlay!).position).toBe('absolute');
    expect(overlay!.querySelector('svg')).toBeTruthy();
  });

  test('applies circle radius and bordered ring', () => {
    const { container } = renderWithProvider(<Avatar bordered avatar="A" shape="circle" />);
    const root = container.firstChild as HTMLElement;

    expect(getComputedStyle(root).borderRadius).toBe('50%');
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

    expect(getComputedStyle(root).cursor).toBe('pointer');

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
