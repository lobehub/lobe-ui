import {
  closeContextMenu,
  getSnapshot,
  setContextMenuInterceptor,
  showContextMenu,
} from '../store';
import type { ContextMenuItem } from '../type';

const items: ContextMenuItem[] = [{ key: 'copy', label: 'Copy' }];

afterEach(() => {
  setContextMenuInterceptor(null);
  closeContextMenu();
});

describe('setContextMenuInterceptor', () => {
  it('routes showContextMenu through the interceptor without opening the web menu', () => {
    const show = vi.fn();
    setContextMenuInterceptor({ show });

    showContextMenu(items, { iconAlign: 'start' });

    expect(show).toHaveBeenCalledTimes(1);
    expect(show.mock.calls[0][0]).toBe(items);
    expect(show.mock.calls[0][1]).toEqual({ iconAlign: 'start' });
    expect(getSnapshot().open).toBe(false);
  });

  it('opens the web menu when the interceptor invokes fallback', () => {
    setContextMenuInterceptor({
      show: (_items, _options, fallback) => fallback(),
    });

    showContextMenu(items);

    expect(getSnapshot().open).toBe(true);
    expect(getSnapshot().items).toBe(items);
  });

  it('routes closeContextMenu through the interceptor and closes only via fallback', () => {
    showContextMenu(items);
    expect(getSnapshot().open).toBe(true);

    let deferredClose: (() => void) | undefined;
    setContextMenuInterceptor({
      close: (fallback) => {
        deferredClose = fallback;
      },
    });

    closeContextMenu();
    expect(getSnapshot().open).toBe(true);

    deferredClose?.();
    expect(getSnapshot().open).toBe(false);
  });

  it('restores default behavior when unregistered with null', () => {
    const show = vi.fn();
    setContextMenuInterceptor({ show });
    setContextMenuInterceptor(null);

    showContextMenu(items);

    expect(show).not.toHaveBeenCalled();
    expect(getSnapshot().open).toBe(true);
  });

  it('leaves an interceptor without the invoked hook falling back to default', () => {
    setContextMenuInterceptor({ close: vi.fn() });

    showContextMenu(items);

    expect(getSnapshot().open).toBe(true);
  });
});
