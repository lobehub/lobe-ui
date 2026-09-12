import { act, render, screen, waitFor } from '@testing-library/react';

import AppElementContext from '@/ThemeProvider/AppElementContext';

import { ContextMenuHost } from '../ContextMenuHost';
import { closeContextMenu, showContextMenu } from '../store';
import type { ContextMenuItem } from '../type';

const VIEWPORT_HEIGHT = 200;
const ROW_HEIGHT = 32;

// jsdom has no layout: report a bounded viewport and fixed rows so virtua can pick a window.
Element.prototype.getAnimations ??= () => [];
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
    const height = target.parentElement?.hasAttribute('data-virtual')
      ? VIEWPORT_HEIGHT
      : ROW_HEIGHT;
    queueMicrotask(() => {
      this.callback(
        [{ contentRect: { height, width: 220 }, target } as ResizeObserverEntry],
        this as any,
      );
    });
  }

  unobserve() {}
} as any;

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
const items: ContextMenuItem[] = Array.from({ length: COUNT }, (_, index) => ({
  key: `item-${index}`,
  label: `Item ${index}`,
}));

const countMenuItems = () => document.querySelectorAll('[role="menuitem"]').length;

const renderHost = () =>
  render(
    <AppElementContext value={document.body as unknown as HTMLDivElement}>
      <ContextMenuHost />
    </AppElementContext>,
  );

describe('ContextMenu virtual', () => {
  afterEach(() => {
    act(() => closeContextMenu());
  });

  test('mounts only a window of items with pinned slots', async () => {
    renderHost();

    act(() => {
      showContextMenu(items, {
        footer: <div data-testid="cm-footer">Footer</div>,
        header: <div data-testid="cm-header">Header</div>,
        listItemHeight: ROW_HEIGHT,
        virtual: true,
      });
    });

    await waitFor(() => expect(countMenuItems()).toBeGreaterThan(0));
    expect(countMenuItems()).toBeLessThan(100);
    expect(screen.getByText('Item 0')).toBeDefined();
    expect(screen.queryByText(`Item ${COUNT - 1}`)).toBeNull();
    expect(screen.getByTestId('cm-header').closest('[data-virtual]')).toBeNull();
    expect(screen.getByTestId('cm-footer').closest('[data-virtual]')).toBeNull();
  });

  test('renders every item when virtual is off', () => {
    renderHost();

    act(() => {
      showContextMenu(items);
    });

    expect(countMenuItems()).toBe(COUNT);
  });
});
