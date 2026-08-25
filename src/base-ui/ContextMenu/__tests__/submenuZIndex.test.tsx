import { act, render, screen, waitFor } from '@testing-library/react';

import AppElementContext from '@/ThemeProvider/AppElementContext';

import { Z_INDEX_LAYER } from '../../zIndex/constants';
import { __resetLayerZIndexForTests, __seedMainTopForTests } from '../../zIndex/manager';
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

const submenuItems: ContextMenuItem[] = [
  {
    children: [{ key: 'email', label: 'Email' }],
    defaultOpen: true,
    key: 'share',
    label: 'Share',
  },
];

const renderHost = () =>
  render(
    <AppElementContext value={document.body as unknown as HTMLDivElement}>
      <ContextMenuHost />
    </AppElementContext>,
  );

const getRootPositioner = () => {
  const share = screen.getByRole('menuitem', { name: 'Share' });
  const rootMenu = share.closest('[role="menu"]');
  expect(rootMenu).not.toBeNull();
  return rootMenu!.parentElement as HTMLElement;
};

const getSubmenuPositioner = () => {
  const email = screen.getByRole('menuitem', { name: 'Email' });
  const submenu = email.closest('[role="menu"]');
  expect(submenu).not.toBeNull();
  return submenu!.parentElement as HTMLElement;
};

describe('ContextMenu submenu z-index stacking (#608)', () => {
  beforeEach(() => {
    __resetLayerZIndexForTests();
  });

  afterEach(() => {
    act(() => closeContextMenu());
    __resetLayerZIndexForTests();
  });

  test('nested submenu stays above root when root z-index exceeds the CSS submenu fallback', async () => {
    // Simulate ~10 prior floating layer acquisitions so the next root open
    // lands at/above 1200, past the hard-coded submenu CSS z-index (1199).
    __seedMainTopForTests(Z_INDEX_LAYER.floating + Z_INDEX_LAYER.step * 9);

    renderHost();

    act(() => {
      showContextMenu(submenuItems);
    });

    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Email' })).toBeDefined();
    });

    const rootZ = Number(getRootPositioner().style.zIndex);
    const submenuZ = Number(getSubmenuPositioner().style.zIndex);

    expect(rootZ).toBeGreaterThanOrEqual(1200);
    expect(submenuZ).toBeGreaterThan(rootZ);
  });
});
