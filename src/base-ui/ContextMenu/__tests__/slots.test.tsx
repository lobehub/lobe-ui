import { act, render, screen } from '@testing-library/react';

import AppElementContext from '@/ThemeProvider/AppElementContext';

import { ContextMenuHost } from '../ContextMenuHost';
import { closeContextMenu, showContextMenu } from '../store';
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

const items: ContextMenuItem[] = [{ key: 'a', label: 'Item A' }];

const renderHost = () =>
  render(
    <AppElementContext value={document.body as unknown as HTMLDivElement}>
      <ContextMenuHost />
    </AppElementContext>,
  );

describe('ContextMenu header/footer slots', () => {
  afterEach(() => {
    act(() => closeContextMenu());
  });

  test('showContextMenu renders header and footer', () => {
    renderHost();

    act(() => {
      showContextMenu(items, {
        footer: <div data-testid="cm-footer">Footer</div>,
        header: <div data-testid="cm-header">Header</div>,
      });
    });

    expect(screen.getByTestId('cm-header')).toBeDefined();
    expect(screen.getByTestId('cm-footer')).toBeDefined();
    expect(screen.getAllByRole('menuitem')).toHaveLength(1);
  });

  test('closeContextMenu clears the slots', () => {
    renderHost();

    act(() => {
      showContextMenu(items, {
        header: <div data-testid="cm-header">Header</div>,
      });
    });
    expect(screen.getByTestId('cm-header')).toBeDefined();

    act(() => closeContextMenu());
    expect(screen.queryByTestId('cm-header')).toBeNull();
  });
});

const submenuItems: ContextMenuItem[] = [
  {
    children: [{ key: 'sub-a', label: 'Sub A' }],
    defaultOpen: true,
    footer: <div data-testid="cm-submenu-footer">Submenu Footer</div>,
    header: <div data-testid="cm-submenu-header">Submenu Header</div>,
    key: 'parent',
    label: 'Parent',
  },
];

describe('ContextMenu submenu header/footer slots', () => {
  afterEach(() => {
    act(() => closeContextMenu());
  });

  test('renders header and footer inside the open submenu popup', () => {
    renderHost();

    act(() => {
      showContextMenu(submenuItems);
    });

    expect(screen.getByTestId('cm-submenu-header')).toBeDefined();
    expect(screen.getByTestId('cm-submenu-footer')).toBeDefined();
    expect(screen.getByText('Sub A')).toBeDefined();
  });

  test('submenu slots are not registered as menu items', () => {
    renderHost();

    act(() => {
      showContextMenu(submenuItems);
    });

    expect(screen.getByTestId('cm-submenu-header').closest('[role="menuitem"]')).toBeNull();
    expect(screen.getByTestId('cm-submenu-footer').closest('[role="menuitem"]')).toBeNull();
  });
});
