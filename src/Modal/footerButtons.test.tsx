import { act, cleanup, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactElement, ReactNode } from 'react';

import { MotionProvider } from '@/MotionProvider';

import { confirmModal, ModalHost } from './imperative';
import Modal from './Modal';

const Wrapper = ({ children }: { children: ReactNode }) => (
  <MotionProvider motion={motion}>{children}</MotionProvider>
);

const renderUi = (node: ReactElement) => render(node, { wrapper: Wrapper });

afterEach(cleanup);

describe('modal footer: variant', () => {
  it('Modal footer is filled by default and borderless on request', () => {
    const { rerender } = renderUi(
      <Modal open title="Title" onCancel={() => {}} onOk={() => {}}>
        Body
      </Modal>,
    );
    expect(
      screen
        .getByRole('button', { name: 'OK' })
        .closest('[data-variant]')
        ?.getAttribute('data-variant'),
    ).toBe('filled');

    rerender(
      <Modal open footerVariant="borderless" title="Title" onCancel={() => {}} onOk={() => {}}>
        Body
      </Modal>,
    );
    expect(
      screen
        .getByRole('button', { name: 'OK' })
        .closest('[data-variant]')
        ?.getAttribute('data-variant'),
    ).toBe('borderless');
  });

  it('confirmModal accepts footerVariant', async () => {
    renderUi(<ModalHost />);
    await act(async () => {
      confirmModal({
        content: 'Sure?',
        footerVariant: 'borderless',
        okText: 'OK',
        title: 'Confirm',
      });
    });

    expect(
      (await screen.findByRole('button', { name: 'OK' }))
        .closest('[data-variant]')
        ?.getAttribute('data-variant'),
    ).toBe('borderless');
  });
});

describe('modal footer: the secondary button is an outlined button on the footer band', () => {
  it('Modal built-in footer', () => {
    renderUi(
      <Modal open cancelText="Cancel" okText="OK" title="Title" onCancel={() => {}} onOk={() => {}}>
        Body
      </Modal>,
    );

    expect(screen.getByRole('button', { name: 'Cancel' }).dataset.type).toBe('default');
    expect(screen.getByRole('button', { name: 'OK' }).dataset.type).toBe('primary');
  });

  it('Modal cancelButtonProps can still override the variant', () => {
    renderUi(
      <Modal
        open
        cancelButtonProps={{ type: 'text' }}
        cancelText="Cancel"
        title="Title"
        onCancel={() => {}}
        onOk={() => {}}
      >
        Body
      </Modal>,
    );

    expect(screen.getByRole('button', { name: 'Cancel' }).dataset.type).toBe('text');
  });

  it('confirmModal', async () => {
    renderUi(<ModalHost />);
    await act(async () => {
      confirmModal({ cancelText: 'Cancel', content: 'Sure?', okText: 'OK', title: 'Confirm' });
    });

    expect((await screen.findByRole('button', { name: 'Cancel' })).dataset.type).toBe('default');
    expect(screen.getByRole('button', { name: 'OK' }).dataset.type).toBe('primary');
  });
});
