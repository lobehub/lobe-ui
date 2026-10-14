import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { type ReactNode, useRef } from 'react';

import PickerContext from '../core/PickerInput/context';
import PickerPopup, { type PickerPopupProps } from '../core/PickerPopup';
import { render } from './render';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

const Harness = ({
  children,
  ...props
}: Partial<Omit<PickerPopupProps, 'children' | 'getAnchor'>> & { children?: ReactNode }) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  return (
    <PickerContext value={{ prefixCls: 'lobe-picker' } as any}>
      <PickerPopup
        getAnchor={() => anchorRef.current}
        popupElement={<div data-testid="panel">panel</div>}
        visible={false}
        onClose={() => {}}
        {...props}
      >
        <div data-testid="anchor" ref={anchorRef}>
          <input aria-label="field" />
        </div>
      </PickerPopup>
      {children}
    </PickerContext>
  );
};

const popup = () => document.querySelector<HTMLElement>('.lobe-picker-dropdown');

describe('PickerPopup', () => {
  afterEach(cleanup);

  test('renders nothing while hidden', () => {
    render(<Harness />);
    expect(popup()).toBeNull();
  });

  test('portals the panel into the popup container with the dropdown classes', () => {
    const container = document.createElement('section');
    document.body.append(container);
    render(
      <Harness
        range
        visible
        direction="rtl"
        getPopupContainer={() => container}
        popupClassName="custom"
      />,
    );

    const element = popup()!;
    expect(container.contains(element)).toBe(true);
    expect(element.className).toContain('lobe-picker-dropdown-range');
    expect(element.className).toContain('lobe-picker-dropdown-rtl');
    expect(element.className).toContain('custom');
    expect(screen.getByTestId('panel')).toBeTruthy();
    container.remove();
  });

  test('a press on the anchor does not close; a press elsewhere does', () => {
    const onClose = vi.fn();
    render(
      <Harness visible onClose={onClose}>
        <button type="button">outside</button>
      </Harness>,
    );

    fireEvent.pointerDown(screen.getByLabelText('field'));
    fireEvent.mouseDown(screen.getByLabelText('field'));
    fireEvent.click(screen.getByLabelText('field'));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.pointerDown(screen.getByText('outside'));
    fireEvent.mouseDown(screen.getByText('outside'));
    fireEvent.click(screen.getByText('outside'));
    expect(onClose).toHaveBeenCalled();
  });

  test('unmounts the popup after it is hidden', async () => {
    const { rerender } = render(<Harness visible />);
    expect(popup()).not.toBeNull();
    rerender(<Harness visible={false} />);
    await waitFor(() => expect(popup()).toBeNull());
  });

  test('inline mode keeps the positioner in the stacking flow and drops the panel at once', () => {
    const { rerender } = render(<Harness inline visible />);
    expect((popup()!.parentElement as HTMLElement).style.zIndex).toBe('auto');
    rerender(<Harness inline visible={false} />);
    expect(popup()).toBeNull();
  });
});
