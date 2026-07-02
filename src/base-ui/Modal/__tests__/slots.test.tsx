import { act, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import { MotionProvider } from '@/MotionProvider';
import AppElementContext from '@/ThemeProvider/AppElementContext';

import { ModalFooter } from '../atoms';
import { createModalSystem } from '../imperative';
import Modal from '../Modal';

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

describe('Modal slot spacing attributes', () => {
  test('marks declarative content when header and footer slots are present', () => {
    render(
      <MotionProvider motion={motion}>
        <Modal open footer={<button type="button">Save</button>} title="Edit profile">
          <div data-testid="modal-body">Body</div>
        </Modal>
      </MotionProvider>,
    );

    const content = screen.getByTestId('modal-body').parentElement;

    expect(content?.getAttribute('data-has-header')).toBe('');
    expect(content?.getAttribute('data-has-footer')).toBe('');
  });

  test('marks imperative content when title and footer slots are present', () => {
    const { ModalHost, createModal } = createModalSystem();
    let instance: ReturnType<typeof createModal> | undefined;

    render(
      <MotionProvider motion={motion}>
        <AppElementContext value={document.body as unknown as HTMLDivElement}>
          <ModalHost />
        </AppElementContext>
      </MotionProvider>,
    );

    act(() => {
      instance = createModal({
        content: <div data-testid="imperative-modal-body">Body</div>,
        footer: <div>Footer</div>,
        title: 'Edit profile',
      });
    });

    const content = screen.getByTestId('imperative-modal-body').parentElement;

    expect(content?.getAttribute('data-has-header')).toBe('');
    expect(content?.getAttribute('data-has-footer')).toBe('');

    act(() => {
      instance?.destroy();
    });
  });

  test('exposes a footer marker when ModalFooter is rendered inside content', () => {
    render(
      <MotionProvider motion={motion}>
        <Modal open footer={null} title="Edit profile">
          <div>
            <div data-testid="content-body">Body</div>
            <ModalFooter data-testid="content-footer">Footer</ModalFooter>
          </div>
        </Modal>
      </MotionProvider>,
    );

    expect(screen.getByTestId('content-footer').getAttribute('data-lobe-modal-footer')).toBe('');
  });
});
