import { render, screen } from '@testing-library/react';

import {
  DropdownMenuItem,
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuScrollViewport,
  DropdownMenuTrigger,
} from '../atoms';
import DropdownMenu from '../DropdownMenu';
import type { DropdownItem } from '../type';

const VIEWPORT_HEIGHT = 200;
const ROW_HEIGHT = 32;

// jsdom has no layout: report a bounded viewport and fixed rows so virtua can pick a window.
Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
  configurable: true,
  get() {
    return this.parentElement;
  },
});

globalThis.ResizeObserver = class {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  disconnect() {}

  observe(target: Element) {
    const height = target.hasAttribute('data-virtual') ? VIEWPORT_HEIGHT : ROW_HEIGHT;
    this.callback(
      [{ contentRect: { height, width: 220 }, target } as ResizeObserverEntry],
      this as any,
    );
  }

  unobserve() {}
} as any;

const countMenuItems = () => document.querySelectorAll('[role="menuitem"]').length;

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

const COUNT = 1000;
const items = Array.from({ length: COUNT }, (_, index) => ({
  key: `item-${index}`,
  label: `Item ${index}`,
})) satisfies DropdownItem[];

describe('DropdownMenu virtual', () => {
  test('composed DropdownMenu mounts only a window of items', () => {
    render(
      <DropdownMenu open virtual items={items} listItemHeight={ROW_HEIGHT}>
        <button type="button">trigger</button>
      </DropdownMenu>,
    );

    const rendered = countMenuItems();
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(100);
    expect(screen.getByText('Item 0')).toBeDefined();
    expect(screen.queryByText(`Item ${COUNT - 1}`)).toBeNull();
  });

  test('composed DropdownMenu renders every item when virtual is off', () => {
    render(
      <DropdownMenu open items={items}>
        <button type="button">trigger</button>
      </DropdownMenu>,
    );

    expect(countMenuItems()).toBe(COUNT);
  });

  test('DropdownMenuScrollViewport virtualizes arbitrary item children', () => {
    render(
      <DropdownMenuRoot open>
        <DropdownMenuTrigger>
          <button type="button">trigger</button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner>
            <DropdownMenuPopup>
              <DropdownMenuScrollViewport
                virtual
                keepMounted={[COUNT - 1]}
                listItemHeight={ROW_HEIGHT}
              >
                {items.map((item, index) => (
                  <DropdownMenuItem key={item.key}>
                    <span data-testid={`row-${index}`}>{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuScrollViewport>
            </DropdownMenuPopup>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>,
    );

    const rendered = countMenuItems();
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(100);
    expect(screen.getByTestId('row-0')).toBeDefined();
    expect(screen.getByTestId(`row-${COUNT - 1}`)).toBeDefined();
    expect(screen.queryByTestId('row-500')).toBeNull();
  });
});
