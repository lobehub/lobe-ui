import { fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';

import { type ScrollTarget, useScroll } from './useScroll';

let position: { left: number; top: number } | undefined;

const RefProbe = () => {
  const ref = useRef<HTMLDivElement>(null);
  position = useScroll(ref);
  return <div data-testid="box" ref={ref} />;
};

const TargetProbe = ({ target }: { target: ScrollTarget }) => {
  position = useScroll(target);
  return null;
};

describe('useScroll', () => {
  it('tracks the scroll position of a ref target', () => {
    const { getByTestId } = render(<RefProbe />);
    expect(position).toEqual({ left: 0, top: 0 });
    const box = getByTestId('box');
    box.scrollTop = 150;
    box.scrollLeft = 10;
    fireEvent.scroll(box);
    expect(position).toEqual({ left: 10, top: 150 });
  });

  it('accepts a getter target', () => {
    const element = document.createElement('div');
    document.body.append(element);
    render(<TargetProbe target={() => element} />);
    element.scrollTop = 42;
    fireEvent.scroll(element);
    expect(position).toEqual({ left: 0, top: 42 });
    element.remove();
  });

  it('reads the scrolling element when the target is the document', () => {
    render(<TargetProbe target={document} />);
    const scroller = document.scrollingElement ?? document.documentElement;
    scroller.scrollTop = 7;
    fireEvent.scroll(document);
    expect(position).toEqual({ left: 0, top: 7 });
  });
});

describe('useScroll with an inline getter', () => {
  it('settles instead of re-rendering forever', () => {
    const element = document.createElement('div');
    let renders = 0;
    const InlineProbe = () => {
      renders += 1;
      position = useScroll(() => element);
      return null;
    };
    render(<InlineProbe />);
    expect(renders).toBeLessThan(5);
  });
});
