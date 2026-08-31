import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';

import ActionIcon from '../ActionIcon';
import type { ActionIconProps } from '../type';
import { actionIconOutdent, calcOutdent, calcSize } from '../utils';

const renderActionIcon = (ui: ReactNode) =>
  render(<ConfigProvider motion={motion}>{ui}</ConfigProvider>);

describe('ActionIcon', () => {
  afterEach(cleanup);

  test('renders a native button root with preset sizing', () => {
    renderActionIcon(<ActionIcon icon={Settings} size="small" />);

    const root = screen.getByRole('button');

    expect(root.getAttribute('type')).toBe('button');
    expect(root.style.width).toBe('24px');
    expect(root.style.height).toBe('24px');
    expect(root.style.borderRadius).toBe('4px');
    expect(root.tabIndex).toBe(0);
  });

  test('derives sizing from numeric size and passes config through', () => {
    const { rerender } = renderActionIcon(<ActionIcon icon={Settings} size={32} />);

    const root = screen.getByRole('button');
    expect(root.style.width).toBe('57.6px');
    expect(root.style.height).toBe('57.6px');
    expect(root.style.borderRadius).toBe('9px');

    rerender(
      <ConfigProvider motion={motion}>
        <ActionIcon icon={Settings} size={{ blockSize: 48, borderRadius: 12 }} />
      </ConfigProvider>,
    );

    expect(root.style.width).toBe('48px');
    expect(root.style.borderRadius).toBe('12px');
  });

  test('calcSize falls back to em units for undefined size', () => {
    expect(calcSize(undefined)).toEqual({ blockSize: '1.8em', borderRadius: '0.3em' });
    expect(calcSize('large')).toEqual({ blockSize: 44, borderRadius: 8 });
    expect(calcSize({ blockSize: 40 })).toEqual({ blockSize: 40, borderRadius: 6 });
  });

  test('calcOutdent is half of block minus glyph', () => {
    expect(calcOutdent('small')).toBe(`${actionIconOutdent.small}px`);
    expect(calcOutdent('middle')).toBe(`${actionIconOutdent.middle}px`);
    expect(calcOutdent('large')).toBe(`${actionIconOutdent.large}px`);
    expect(calcOutdent(32)).toBe('12.8px');
    expect(calcOutdent({ blockSize: 48 })).toBe('12px');
    expect(calcOutdent(undefined)).toBe('0.4em');
  });

  test('blocks clicks while disabled and marks the root untabbable', () => {
    const handleClick = vi.fn();

    renderActionIcon(<ActionIcon disabled icon={Settings} onClick={handleClick} />);

    const root = screen.getByRole('button');

    expect(root.tabIndex).toBe(-1);

    fireEvent.click(root);

    expect(handleClick).not.toHaveBeenCalled();
  });

  test('hides the icon behind the loading spinner, flags aria-busy, and blocks clicks', () => {
    const handleClick = vi.fn();

    const { container } = renderActionIcon(
      <ActionIcon loading icon={Settings} onClick={handleClick} />,
    );

    const root = screen.getByRole('button');

    expect(container.querySelector('svg.lucide-settings')).toBeNull();
    expect(root.getAttribute('aria-busy')).toBe('true');

    fireEvent.click(root);

    expect(handleClick).not.toHaveBeenCalled();
  });

  test('fires the click handler on interaction', () => {
    const handleClick = vi.fn();

    renderActionIcon(<ActionIcon icon={Settings} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('defaults aria-label from title for popup triggers', () => {
    renderActionIcon(<ActionIcon aria-haspopup="menu" icon={Settings} title="More options" />);

    expect(screen.getByRole('button').getAttribute('aria-label')).toBe('More options');
  });

  test('keeps the tooltip trigger as the action root when title is set', () => {
    renderActionIcon(<ActionIcon icon={Settings} title="Settings" />);

    const root = screen.getByRole('button');

    expect(root.getAttribute('aria-label')).toBeNull();
    expect(root.querySelector('svg.lucide-settings')).not.toBeNull();
  });

  test('applies classNames and styles slots onto root and icon', () => {
    const { container } = renderActionIcon(
      <ActionIcon
        classNames={{ icon: 'icon-slot', root: 'root-slot' }}
        icon={Settings}
        styles={{ root: { background: 'rgb(255, 0, 0)' } }}
      />,
    );

    const root = screen.getByRole('button');

    expect(root.classList.contains('root-slot')).toBe(true);
    expect(container.querySelector('.icon-slot')).not.toBeNull();
    expect(getComputedStyle(root).background).toBe('rgb(255, 0, 0)');
  });

  test.each(['small', 'middle', 'large'] as const)(
    'outdent on a borderless ActionIcon cancels %s icon inset',
    (size) => {
      renderActionIcon(<ActionIcon outdent icon={Settings} size={size} />);

      expect(getComputedStyle(screen.getByRole('button')).marginInlineStart).toBe(
        `-${actionIconOutdent[size]}px`,
      );
    },
  );

  test('outdent="end" cancels inset on the end edge', () => {
    renderActionIcon(<ActionIcon icon={Settings} outdent={'end'} />);

    const style = getComputedStyle(screen.getByRole('button'));

    expect(style.marginInlineEnd).toBe(`-${actionIconOutdent.middle}px`);
    expect(style.marginInlineStart).not.toBe(`-${actionIconOutdent.middle}px`);
  });
});

{
  const borderless: ActionIconProps<'borderless'> = { outdent: true, variant: 'borderless' };
  void borderless;
  // @ts-expect-error outdent is only on variant="borderless"
  const filled: ActionIconProps<'filled'> = { outdent: true, variant: 'filled' };
  void filled;
}
