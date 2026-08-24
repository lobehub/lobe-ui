import { fireEvent, render, screen } from '@testing-library/react';

import DropdownMenu from '../DropdownMenu';
import type { DropdownItem } from '../type';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

vi.mock('antd-style', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    createStaticStyles: vi.fn((fn: any) => () => {
      const result = fn({ css: () => '', cssVar: {} });
      return new Proxy(result, { get: (target, key) => target[key] || '' });
    }),
  };
});

const renderMenu = (items: DropdownItem[]) =>
  render(
    <DropdownMenu defaultOpen items={items}>
      <button type="button">Open menu</button>
    </DropdownMenu>,
  );

describe('DropdownMenu item close behavior', () => {
  test('keeps the menu open when closeOnClick is false', () => {
    const onClick = vi.fn();
    renderMenu([{ closeOnClick: false, key: 'keep-open', label: 'Keep open', onClick }]);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Keep open' }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('menuitem', { name: 'Keep open' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded')).toBe(
      'true',
    );
  });

  test('preserves the default behavior of closing after an item click', () => {
    renderMenu([{ key: 'close', label: 'Close' }]);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Close' }));

    expect(screen.queryByRole('menuitem', { name: 'Close' })).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'),
    ).not.toBe('true');
  });
});
