import { act, render, screen, waitFor } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useRef } from 'react';

import ConfigProvider from '@/ConfigProvider';
import Drawer from '@/Drawer/Drawer';

import { createModal, ModalHost } from '../imperative';
import Modal from '../Modal';

const renderWithProvider = (node: ReactNode) =>
  render(<ConfigProvider motion={motion}>{node}</ConfigProvider>);

const getPopup = () => document.querySelector<HTMLElement>('[role="dialog"]');

const expectPopupFocused = async () => {
  await waitFor(() => expect(document.activeElement).toBe(getPopup()));
  // The close button stays reachable as the first Tab stop, it just is not focused on open.
  const closeButton = getPopup()?.querySelector('button');
  expect(closeButton).toBeTruthy();
  expect(document.activeElement).not.toBe(closeButton);
  // The popup is the dialog focus anchor, so the global focus ring must skip it.
  expect(getPopup()?.getAttribute('data-lobe-focus-ring')).toBe('self-off');
};

const FormModal = ({ Component }: { Component: typeof Modal | typeof Drawer }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Component open initialFocus={inputRef} title="Form">
      <input aria-label="Name" ref={inputRef} />
    </Component>
  );
};

describe('dialog initial focus', () => {
  test('Modal focuses the popup instead of the close button on open', async () => {
    renderWithProvider(<Modal open title="Auto top-up" />);
    await expectPopupFocused();
  });

  test('Modal focuses the provided initialFocus target', async () => {
    renderWithProvider(<FormModal Component={Modal} />);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText('Name')));
  });

  test('Drawer focuses the popup instead of the close button on open', async () => {
    renderWithProvider(<Drawer open title="Settings" />);
    await expectPopupFocused();
  });

  test('Drawer focuses the provided initialFocus target', async () => {
    renderWithProvider(<FormModal Component={Drawer} />);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText('Name')));
  });

  describe('createModal', () => {
    let instance: ReturnType<typeof createModal> | undefined;

    afterEach(() => {
      act(() => instance?.destroy());
      instance = undefined;
    });

    test('focuses the popup instead of the close button on open', async () => {
      renderWithProvider(<ModalHost />);
      act(() => {
        instance = createModal({ content: 'Body', title: 'Imperative' });
      });
      await expectPopupFocused();
    });

    test('focuses the provided initialFocus target', async () => {
      const input = { current: null as HTMLInputElement | null };
      renderWithProvider(<ModalHost />);
      act(() => {
        instance = createModal({
          content: (
            <input
              aria-label="Name"
              ref={(node) => {
                input.current = node;
              }}
            />
          ),
          initialFocus: input,
          title: 'Imperative',
        });
      });
      await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText('Name')));
    });
  });
});
