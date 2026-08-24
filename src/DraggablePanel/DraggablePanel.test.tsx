import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import DraggablePanel from './DraggablePanel';

const getAside = () => screen.getByText('Panel body').closest('aside') as HTMLElement;

const getResizable = (aside: HTMLElement) =>
  aside.querySelector('.ant-draggable-panel-fixed') as HTMLElement | null;

const getStableOuter = (aside: HTMLElement) => {
  const resizable = getResizable(aside);
  if (!resizable) return null;
  if (resizable.parentElement === aside) return null;
  if (resizable.parentElement?.parentElement === aside) {
    return resizable.parentElement as HTMLElement;
  }
  return null;
};

describe('DraggablePanel stableLayout', () => {
  it('defaults stableLayout to true and keeps a two-layer outer container', () => {
    render(
      <DraggablePanel expand defaultSize={{ width: 200 }} placement="left">
        Panel body
      </DraggablePanel>,
    );

    const aside = getAside();
    const outer = getStableOuter(aside);

    expect(outer).not.toBeNull();
    expect(outer!.style.width).toBe('200px');
    expect(outer!.style.overflow).toBe('hidden');
    expect(getResizable(aside)).not.toBeNull();
    expect(screen.getByText('Panel body')).toBeTruthy();
  });

  it('collapses via outer layer width while keeping content mounted by default', () => {
    const { rerender } = render(
      <DraggablePanel expand defaultSize={{ width: 200 }} placement="left">
        Panel body
      </DraggablePanel>,
    );

    const aside = getAside();
    expect(getStableOuter(aside)!.style.width).toBe('200px');
    expect(screen.getByText('Panel body')).toBeTruthy();

    rerender(
      <DraggablePanel defaultSize={{ width: 200 }} expand={false} placement="left">
        Panel body
      </DraggablePanel>,
    );

    expect(getStableOuter(aside)!.style.width).toBe('0px');
    expect(screen.getByText('Panel body')).toBeTruthy();
    expect(getResizable(aside)).not.toBeNull();
  });

  it.each(['top', 'bottom'] as const)(
    'keeps a fixed %s panel from occupying the parent height outside its stable outer layer',
    (placement) => {
      const { rerender } = render(
        <DraggablePanel expand defaultSize={{ height: 200 }} placement={placement}>
          Panel body
        </DraggablePanel>,
      );

      const aside = getAside();
      expect(aside.style.height).toBe('');
      expect(aside.style.width).toBe('100%');
      expect(getStableOuter(aside)!.style.height).toBe('200px');

      rerender(
        <DraggablePanel defaultSize={{ height: 200 }} expand={false} placement={placement}>
          Panel body
        </DraggablePanel>,
      );

      expect(aside.style.height).toBe('');
      expect(getStableOuter(aside)!.style.height).toBe('0px');
    },
  );

  it('can opt out of stableLayout and zeros resizable size when collapsed', () => {
    const { rerender } = render(
      <DraggablePanel expand defaultSize={{ width: 200 }} placement="left" stableLayout={false}>
        Panel body
      </DraggablePanel>,
    );

    const aside = getAside();
    expect(getStableOuter(aside)).toBeNull();
    expect(screen.getByText('Panel body')).toBeTruthy();

    rerender(
      <DraggablePanel
        defaultSize={{ width: 200 }}
        expand={false}
        placement="left"
        stableLayout={false}
      >
        Panel body
      </DraggablePanel>,
    );

    const resizable = getResizable(aside);
    expect(resizable).not.toBeNull();
    expect(resizable!.style.width).toBe('0px');
  });

  it('toggles expand through the handle when stableLayout is defaulted on', () => {
    render(
      <DraggablePanel defaultExpand defaultSize={{ width: 200 }} placement="left">
        Panel body
      </DraggablePanel>,
    );

    const aside = getAside();
    expect(getStableOuter(aside)!.style.width).toBe('200px');

    const toggle = aside.querySelector('.ant-draggable-panel-toggle') as HTMLElement | null;
    expect(toggle).not.toBeNull();
    fireEvent.click(toggle!.querySelector('div') ?? toggle!);

    expect(getStableOuter(aside)!.style.width).toBe('0px');
    expect(screen.getByText('Panel body')).toBeTruthy();
  });
});
