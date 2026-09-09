import { fireEvent, render, screen } from '@testing-library/react';

import DraggablePanel from '../DraggablePanel';

const pointerDrag = (handle: Element, offset: { x?: number; y?: number }) => {
  fireEvent.pointerDown(handle, { clientX: 0, clientY: 0, pointerId: 1 });
  fireEvent.pointerMove(handle, { clientX: 0, clientY: 0, pointerId: 1 });
  fireEvent.pointerMove(handle, {
    clientX: offset.x ?? 0,
    clientY: offset.y ?? 0,
    pointerId: 1,
  });
  fireEvent.pointerUp(handle, {
    clientX: offset.x ?? 0,
    clientY: offset.y ?? 0,
    pointerId: 1,
  });
};

beforeAll(() => {
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

describe('DraggablePanel', () => {
  test('exposes a separator carrying the current size', () => {
    render(
      <DraggablePanel defaultSize={{ width: 280 }} maxWidth={500} minWidth={200} placement="left">
        content
      </DraggablePanel>,
    );

    const handle = screen.getByRole('separator');
    expect(handle.getAttribute('aria-orientation')).toBe('vertical');
    expect(handle.getAttribute('aria-valuenow')).toBe('280');
    expect(handle.getAttribute('aria-valuemin')).toBe('200');
    expect(handle.getAttribute('aria-valuemax')).toBe('500');
  });

  test('dragging the handle reports the new size', () => {
    const onSizeChange = vi.fn();
    render(
      <DraggablePanel
        defaultSize={{ width: 280 }}
        maxWidth={500}
        minWidth={200}
        placement="left"
        onSizeChange={onSizeChange}
      >
        content
      </DraggablePanel>,
    );

    pointerDrag(screen.getByRole('separator'), { x: 60 });
    expect(onSizeChange).toHaveBeenCalledWith(
      { height: 0, width: 60 },
      { height: '100%', width: 340 },
    );
  });

  test('dragging below collapseThreshold collapses on release and keeps the previous size', () => {
    const onExpandChange = vi.fn();
    const onSizeChange = vi.fn();
    render(
      <DraggablePanel
        collapseThreshold={150}
        defaultSize={{ width: 280 }}
        minWidth={100}
        placement="left"
        onExpandChange={onExpandChange}
        onSizeChange={onSizeChange}
      >
        content
      </DraggablePanel>,
    );

    pointerDrag(screen.getByRole('separator'), { x: -200 });
    expect(onExpandChange.mock.calls[0][0]).toBe(false);
    expect(onSizeChange).toHaveBeenCalledWith(
      { height: 0, width: 0 },
      { height: '100%', width: 280 },
    );
  });

  test('arrow keys resize the panel', () => {
    const onSizeChange = vi.fn();
    render(
      <DraggablePanel
        defaultSize={{ width: 280 }}
        maxWidth={500}
        minWidth={200}
        placement="right"
        onSizeChange={onSizeChange}
      >
        content
      </DraggablePanel>,
    );

    fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowLeft' });
    expect(onSizeChange).toHaveBeenLastCalledWith(
      { height: 0, width: 10 },
      { height: '100%', width: 290 },
    );
  });

  test('the toggle button collapses a controlled panel', () => {
    const onExpandChange = vi.fn();
    render(
      <DraggablePanel expand placement="left" onExpandChange={onExpandChange}>
        content
      </DraggablePanel>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Collapse panel' }));
    expect(onExpandChange.mock.calls[0][0]).toBe(false);
  });

  test('a collapsed panel hides the resize handle but keeps its content mounted', () => {
    render(
      <DraggablePanel expand={false} placement="left">
        content
      </DraggablePanel>,
    );

    expect(screen.queryByRole('separator')).toBeNull();
    expect(screen.getByText('content')).toBeTruthy();
  });

  test('a bottom panel resizes on the block axis', () => {
    const onSizeChange = vi.fn();
    render(
      <DraggablePanel
        defaultSize={{ height: 180 }}
        maxHeight={400}
        minHeight={100}
        placement="bottom"
        onSizeChange={onSizeChange}
      >
        content
      </DraggablePanel>,
    );

    const handle = screen.getByRole('separator');
    expect(handle.getAttribute('aria-orientation')).toBe('horizontal');

    pointerDrag(handle, { y: -40 });
    expect(onSizeChange).toHaveBeenCalledWith(
      { height: 40, width: 0 },
      { height: 220, width: '100%' },
    );
  });
});
