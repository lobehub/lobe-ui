import { act, cleanup, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactElement, ReactNode } from 'react';

import { Drawer, DropdownMenu, FloatingPanel, Modal, Tooltip } from '@/index';
import { MotionProvider } from '@/MotionProvider';
import { __resetToastHostRegistryForTests } from '@/Toast/hostGuard';
import { __resetToastStateForTests, toast, ToastHost } from '@/Toast/imperative';

const Wrapper = ({ children }: { children: ReactNode }) => (
  <MotionProvider motion={motion}>{children}</MotionProvider>
);

const renderUi = (node: ReactElement) => render(node, { wrapper: Wrapper });

const one = (selector: string) => {
  const nodes = document.querySelectorAll<HTMLElement>(selector);
  expect(nodes).toHaveLength(1);
  return nodes[0];
};

afterEach(() => {
  cleanup();
  __resetToastHostRegistryForTests();
  __resetToastStateForTests();
});

describe('overlay blocks sit on the popup box and portal parts mirror lobe-ui data', () => {
  it('Tooltip', () => {
    renderUi(
      <Tooltip open placement="left" popupContainer={document.body} title="Tip">
        <button type="button">Hover</button>
      </Tooltip>,
    );
    const popup = one('.lobe-tooltip');
    const positioner = one('.lobe-tooltip__positioner');

    expect(positioner.contains(popup)).toBe(true);
    expect(positioner.classList.contains('lobe-tooltip')).toBe(false);
    expect(popup.dataset.placement).toBe('left');
    expect(positioner.dataset.placement).toBe('left');
  });

  it('Modal', () => {
    renderUi(
      <Modal open className="user-panel" title="Title">
        Body
      </Modal>,
    );
    const panel = one('.lobe-modal');
    const wrapper = one('.lobe-modal__wrapper');

    expect(panel.classList.contains('user-panel')).toBe(true);
    expect(wrapper.contains(panel)).toBe(true);
    expect(wrapper.classList.contains('lobe-modal')).toBe(false);
    for (const node of [panel, wrapper, one('.lobe-modal__backdrop')]) {
      expect(node.dataset.draggable).toBe('');
    }
  });

  it('Drawer', () => {
    renderUi(
      <Drawer open className="user-panel" placement="left" title="Title">
        Body
      </Drawer>,
    );
    const panel = one('.lobe-drawer');
    const popup = one('.lobe-drawer__popup');

    expect(panel.classList.contains('user-panel')).toBe(true);
    expect(popup.contains(panel)).toBe(true);
    for (const node of [panel, popup, one('.lobe-drawer__backdrop')]) {
      expect(node.dataset.placement).toBe('left');
    }
  });

  it('DropdownMenu', () => {
    renderUi(
      <DropdownMenu open items={[{ key: 'a', label: 'Alpha' }]} placement="top">
        <button type="button">Open</button>
      </DropdownMenu>,
    );
    const popup = one('.lobe-dropdown-menu');
    const positioner = one('.lobe-dropdown-menu__positioner');

    expect(positioner.contains(popup)).toBe(true);
    expect(positioner.classList.contains('lobe-dropdown-menu')).toBe(false);
    expect(popup.dataset.placement).toBe('top');
    expect(positioner.dataset.placement).toBe('top');
  });

  it('FloatingPanel', () => {
    renderUi(
      <FloatingPanel open className="user-panel" placement="topLeft" title="Title">
        Body
      </FloatingPanel>,
    );
    const panel = one('.lobe-floating-panel');
    const wrapper = one('.lobe-floating-panel__wrapper');

    expect(panel.classList.contains('user-panel')).toBe(true);
    expect(panel.dataset.placement).toBe('topLeft');
    expect(wrapper.dataset.placement).toBe('topLeft');
  });

  it('Toast', async () => {
    render(<ToastHost position="top" />);
    await act(async () => {
      toast.success('Saved');
    });
    await screen.findByText('Saved');

    const item = one('.lobe-toast');
    const viewport = item.closest<HTMLElement>('.lobe-toast__viewport')!;

    expect(item.dataset.type).toBe('success');
    expect(item.dataset.position).toBe('top');
    expect(viewport.dataset.position).toBe('top');
  });
});
