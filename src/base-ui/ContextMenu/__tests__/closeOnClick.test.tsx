import { act, fireEvent, render, screen } from '@testing-library/react';

import AppElementContext from '@/ThemeProvider/AppElementContext';

import { ContextMenuHost } from '../ContextMenuHost';
import { closeContextMenu, getSnapshot, showContextMenu } from '../store';
import type { ContextMenuItem } from '../type';

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

const renderMenu = (items: ContextMenuItem[]) => {
  render(
    <AppElementContext value={document.body as unknown as HTMLDivElement}>
      <ContextMenuHost />
    </AppElementContext>,
  );

  act(() => showContextMenu(items));
};

describe('ContextMenu item close behavior', () => {
  afterEach(() => {
    act(() => closeContextMenu());
  });

  test('keeps the menu open when closeOnClick is false', () => {
    const onClick = vi.fn();
    renderMenu([{ closeOnClick: false, key: 'keep-open', label: 'Keep open', onClick }]);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Keep open' }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(getSnapshot().open).toBe(true);
    expect(screen.getByRole('menuitem', { name: 'Keep open' })).toBeDefined();
  });

  test('preserves the default behavior of closing after an item click', () => {
    renderMenu([{ key: 'close', label: 'Close' }]);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Close' }));

    expect(getSnapshot().open).toBe(false);
    expect(screen.queryByRole('menuitem', { name: 'Close' })).toBeNull();
  });
});
