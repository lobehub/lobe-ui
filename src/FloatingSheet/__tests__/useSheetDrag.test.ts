import { act, renderHook } from '@testing-library/react';

import { useSheetDrag } from '../useSheetDrag';

describe('useSheetDrag', () => {
  test('returns drag handler props', () => {
    const { result } = renderHook(() =>
      useSheetDrag({
        enabled: true,
        onDragChange: vi.fn(),
        onDragEnd: vi.fn(),
      }),
    );

    expect(result.current.handleProps).toHaveProperty('onMouseDown');
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

    const mockEvent = {
      button: 0,
      clientY: 500,
      preventDefault: vi.fn(),
      target: document.createElement('div'),
    } as unknown as React.MouseEvent<HTMLDivElement>;

    act(() => {
      result.current.handleProps.onMouseDown(mockEvent);
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
    const mockEvent = {
      button: 0,
      clientY: 500,
      preventDefault: vi.fn(),
      target: button,
    } as unknown as React.MouseEvent<HTMLDivElement>;

    act(() => {
      result.current.handleProps.onMouseDown(mockEvent);
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

    const mockEvent = {
      button: 0,
      clientY: 500,
      preventDefault: vi.fn(),
      target: document.createElement('div'),
    } as unknown as React.MouseEvent<HTMLDivElement>;

    act(() => {
      result.current.handleProps.onMouseDown(mockEvent);
    });

    expect(result.current.isDragging).toBe(true);

    // Simulate mouse move on document
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientY: 450 }));
    });

    expect(onDragChange).toHaveBeenCalledWith(50); // 500 - 450 = 50 (upward)

    // Simulate mouse up on document
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup', { clientY: 450 }));
    });

    expect(onDragEnd).toHaveBeenCalled();
    expect(result.current.isDragging).toBe(false);
  });
});
