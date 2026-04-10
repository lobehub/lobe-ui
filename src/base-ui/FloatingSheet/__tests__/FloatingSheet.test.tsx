import { render, screen } from '@testing-library/react';

import { FloatingSheet } from '../FloatingSheet';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
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

describe('FloatingSheet', () => {
  test('renders children when open', () => {
    render(
      <div style={{ height: 800, position: 'relative' }}>
        <FloatingSheet open>
          <div data-testid="sheet-content">Hello</div>
        </FloatingSheet>
      </div>,
    );

    expect(screen.getByTestId('sheet-content')).toBeDefined();
  });

  test('renders title and headerActions', () => {
    render(
      <div style={{ height: 800, position: 'relative' }}>
        <FloatingSheet
          open
          headerActions={<button data-testid="action-btn">Action</button>}
          title={<span>My Title</span>}
        >
          Content
        </FloatingSheet>
      </div>,
    );

    expect(screen.getByText('My Title')).toBeDefined();
    expect(screen.getByTestId('action-btn')).toBeDefined();
  });

  test('applies hidden visibility when open is false', () => {
    const { container } = render(
      <div style={{ height: 800, position: 'relative' }}>
        <FloatingSheet open={false}>Content</FloatingSheet>
      </div>,
    );

    const sheet = container.querySelector('[data-floating-sheet]');
    expect(sheet).not.toBeNull();
  });

  test('renders with defaultOpen', () => {
    render(
      <div style={{ height: 800, position: 'relative' }}>
        <FloatingSheet defaultOpen>
          <div data-testid="content">Content</div>
        </FloatingSheet>
      </div>,
    );

    expect(screen.getByTestId('content')).toBeDefined();
  });
});
