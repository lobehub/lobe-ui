import { act, renderHook } from '@testing-library/react';

import { useSheetDrag } from '../useSheetDrag';

const handle = () => {
  const element = document.createElement('div');
  element.setPointerCapture ??= vi.fn();
  element.hasPointerCapture ??= () => false;
  element.releasePointerCapture ??= vi.fn();
  return element;
};

const downEvent = (
  overrides: Partial<{ isPrimary: boolean; pointerId: number; target: HTMLElement }> = {},
) => {
  const element = handle();
  return {
    button: 0,
    clientY: 500,
    currentTarget: element,
    isPrimary: true,
    pointerId: 1,
    preventDefault: vi.fn(),
    target: element,
    ...overrides,
  } as unknown as React.PointerEvent<HTMLDivElement>;
};

const pointerEvent = (type: string, init: { clientY?: number; pointerId?: number } = {}) =>
  new PointerEvent(type, { bubbles: true, pointerId: 1, ...init });

describe('useSheetDrag', () => {
  test('returns drag handler props', () => {
    const { result } = renderHook(() =>
      useSheetDrag({
        enabled: true,
        onDragChange: vi.fn(),
        onDragEnd: vi.fn(),
      }),
    );

    expect(result.current.handleProps).toHaveProperty('onPointerDown');
    expect(result.current.isDragging).toBe(false);
  });

  test('does not initiate drag when disabled', () => {
    const { result } = renderHook(() =>
      useSheetDrag({
        enabled: false,
        onDragChange: vi.fn(),
        onDragEnd: vi.fn(),
      }),
    );

    act(() => {
      result.current.handleProps.onPointerDown(downEvent());
    });

    expect(result.current.isDragging).toBe(false);
  });

  test('does not initiate drag on data-no-drag elements', () => {
    const { result } = renderHook(() =>
      useSheetDrag({
        enabled: true,
        onDragChange: vi.fn(),
        onDragEnd: vi.fn(),
      }),
    );

    const button = document.createElement('button');
    button.setAttribute('data-no-drag', '');

    act(() => {
      result.current.handleProps.onPointerDown(downEvent({ target: button }));
    });

    expect(result.current.isDragging).toBe(false);
  });

  test('ignores a non-primary pointer so a second finger cannot hijack the drag', () => {
    const { result } = renderHook(() =>
      useSheetDrag({
        enabled: true,
        onDragChange: vi.fn(),
        onDragEnd: vi.fn(),
      }),
    );

    act(() => {
      result.current.handleProps.onPointerDown(downEvent({ isPrimary: false, pointerId: 2 }));
    });

    expect(result.current.isDragging).toBe(false);
  });

  test('initiates drag and listens on document', () => {
    const onDragChange = vi.fn();
    const onDragEnd = vi.fn();
    const { result } = renderHook(() =>
      useSheetDrag({
        enabled: true,
        onDragChange,
        onDragEnd,
      }),
    );

    act(() => {
      result.current.handleProps.onPointerDown(downEvent());
    });

    expect(result.current.isDragging).toBe(true);

    act(() => {
      document.dispatchEvent(pointerEvent('pointermove', { clientY: 450 }));
    });

    expect(onDragChange).toHaveBeenCalledWith(50); // 500 - 450 = 50 (upward)

    act(() => {
      document.dispatchEvent(pointerEvent('pointerup', { clientY: 450 }));
    });

    expect(onDragEnd).toHaveBeenCalled();
    expect(result.current.isDragging).toBe(false);
  });

  test('ignores document events from a different pointer', () => {
    const onDragChange = vi.fn();
    const { result } = renderHook(() =>
      useSheetDrag({
        enabled: true,
        onDragChange,
        onDragEnd: vi.fn(),
      }),
    );

    act(() => {
      result.current.handleProps.onPointerDown(downEvent());
    });

    act(() => {
      document.dispatchEvent(pointerEvent('pointermove', { clientY: 450, pointerId: 2 }));
    });

    expect(onDragChange).not.toHaveBeenCalled();
    expect(result.current.isDragging).toBe(true);
  });

  test('settles without a fling when the gesture is cancelled', () => {
    const onDragEnd = vi.fn();
    const { result } = renderHook(() =>
      useSheetDrag({
        enabled: true,
        onDragChange: vi.fn(),
        onDragEnd,
      }),
    );

    act(() => {
      result.current.handleProps.onPointerDown(downEvent());
    });

    act(() => {
      document.dispatchEvent(pointerEvent('pointermove', { clientY: 300 }));
    });

    act(() => {
      document.dispatchEvent(pointerEvent('pointercancel', { clientY: 300 }));
    });

    // Zero distance and zero velocity: return to where the drag started.
    expect(onDragEnd).toHaveBeenCalledWith(0, 0);
    expect(result.current.isDragging).toBe(false);
  });
});
