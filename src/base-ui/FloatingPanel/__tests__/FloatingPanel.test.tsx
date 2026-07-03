import { render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';

import { FloatingPanel } from '../FloatingPanel';

vi.mock('antd-style', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd-style')>();
  return {
    ...actual,
    createStaticStyles: vi.fn((fn: any) => () => {
      const result = fn({ css: () => '', cssVar: {} });
      return new Proxy(result, { get: (target, key) => target[key as keyof typeof target] || '' });
    }),
  };
});

const renderWithProvider = (node: ReactNode) =>
  render(<ConfigProvider motion={motion}>{node}</ConfigProvider>);

describe('FloatingPanel', () => {
  test('renders title, actions, footer, and children when open', () => {
    renderWithProvider(
      <FloatingPanel
        open
        actions={<button>Share</button>}
        footer={<button>Reply</button>}
        title="Run detail"
      >
        <div>Panel content</div>
      </FloatingPanel>,
    );

    expect(screen.getByText('Run detail')).toBeDefined();
    expect(screen.getByText('Share')).toBeDefined();
    expect(screen.getByText('Reply')).toBeDefined();
    expect(screen.getByText('Panel content')).toBeDefined();
  });

  test('does not render the close button when closable is false', () => {
    renderWithProvider(
      <FloatingPanel open closable={false} title="Run detail">
        Content
      </FloatingPanel>,
    );

    expect(screen.queryByLabelText('Close')).toBeNull();
  });

  test('passes custom close label to the modal close atom', () => {
    renderWithProvider(
      <FloatingPanel open closeLabel="Close run panel" title="Run detail">
        Content
      </FloatingPanel>,
    );

    expect(screen.getByLabelText('Close run panel')).toBeDefined();
  });

  test('renders anchored resize handles by default', () => {
    renderWithProvider(
      <FloatingPanel open title="Run detail">
        Content
      </FloatingPanel>,
    );

    expect(document.querySelector('[data-floating-panel-resize-handle="top"]')).toBeDefined();
    expect(document.querySelector('[data-floating-panel-resize-handle="left"]')).toBeDefined();
    expect(document.querySelector('[data-floating-panel-resize-handle="topLeft"]')).toBeDefined();
  });

  test('does not render resize handles when resizable is false', () => {
    renderWithProvider(
      <FloatingPanel open resizable={false} title="Run detail">
        Content
      </FloatingPanel>,
    );

    expect(document.querySelector('[data-floating-panel-resize-handle]')).toBeNull();
  });

  test('reports resized dimensions when dragging a resize handle', () => {
    const onResize = vi.fn();
    const onResizeEnd = vi.fn();

    renderWithProvider(
      <FloatingPanel open title="Run detail" onResize={onResize} onResizeEnd={onResizeEnd}>
        Content
      </FloatingPanel>,
    );

    const handle = document.querySelector('[data-floating-panel-resize-handle="topLeft"]');
    expect(handle).not.toBeNull();

    Object.defineProperty(handle!.parentElement, 'getBoundingClientRect', {
      value: () => ({ height: 360, width: 640 }),
    });

    handle!.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, clientX: 100, clientY: 100 }),
    );
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 60, clientY: 70 }));
    window.dispatchEvent(new MouseEvent('pointerup'));

    expect(onResize).toHaveBeenCalledWith({ height: 390, width: 680 });
    expect(onResizeEnd).toHaveBeenCalledWith({ height: 390, width: 680 });
  });
});
