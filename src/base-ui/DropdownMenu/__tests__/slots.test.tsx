import { render, screen } from '@testing-library/react';

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

const items: DropdownItem[] = [
  { key: 'a', label: 'Item A' },
  { key: 'b', label: 'Item B' },
];

describe('DropdownMenu header/footer slots', () => {
  test('renders header and footer alongside items', () => {
    render(
      <DropdownMenu
        open
        footer={<div data-testid="dm-footer">Footer</div>}
        header={<div data-testid="dm-header">Header</div>}
        items={items}
      >
        <button type="button">trigger</button>
      </DropdownMenu>,
    );

    expect(screen.getByTestId('dm-header')).toBeDefined();
    expect(screen.getByTestId('dm-footer')).toBeDefined();
    expect(screen.getByText('Item A')).toBeDefined();
  });

  test('header and footer are not registered as menu items', () => {
    render(
      <DropdownMenu
        open
        footer={<div data-testid="dm-footer">Footer</div>}
        header={<div data-testid="dm-header">Header</div>}
        items={items}
      >
        <button type="button">trigger</button>
      </DropdownMenu>,
    );

    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  test('renders items when no slots are provided', () => {
    render(
      <DropdownMenu open items={items}>
        <button type="button">trigger</button>
      </DropdownMenu>,
    );

    expect(screen.getByText('Item A')).toBeDefined();
    expect(screen.getByText('Item B')).toBeDefined();
  });
});

const submenuItems: DropdownItem[] = [
  {
    children: [
      { key: 'sub-a', label: 'Sub A' },
      { key: 'sub-b', label: 'Sub B' },
    ],
    defaultOpen: true,
    footer: <div data-testid="submenu-footer">Submenu Footer</div>,
    header: <div data-testid="submenu-header">Submenu Header</div>,
    key: 'parent',
    label: 'Parent',
  },
];

describe('DropdownMenu submenu header/footer slots', () => {
  test('renders header and footer inside the open submenu popup', () => {
    render(
      <DropdownMenu open items={submenuItems}>
        <button type="button">trigger</button>
      </DropdownMenu>,
    );

    expect(screen.getByTestId('submenu-header')).toBeDefined();
    expect(screen.getByTestId('submenu-footer')).toBeDefined();
    expect(screen.getByText('Sub A')).toBeDefined();
  });

  test('submenu slots are not registered as menu items', () => {
    render(
      <DropdownMenu open items={submenuItems}>
        <button type="button">trigger</button>
      </DropdownMenu>,
    );

    expect(screen.getByTestId('submenu-header').closest('[role="menuitem"]')).toBeNull();
    expect(screen.getByTestId('submenu-footer').closest('[role="menuitem"]')).toBeNull();
  });
});
