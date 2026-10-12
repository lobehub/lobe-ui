import { fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';

import { useHover } from './useHover';

let hovering: boolean | undefined;

const Probe = () => {
  const ref = useRef<HTMLDivElement>(null);
  hovering = useHover(ref);
  return <div data-testid="box" ref={ref} />;
};

describe('useHover', () => {
  it('is true between mouseenter and mouseleave', () => {
    const { getByTestId } = render(<Probe />);
    expect(hovering).toBe(false);
    fireEvent.mouseEnter(getByTestId('box'));
    expect(hovering).toBe(true);
    fireEvent.mouseLeave(getByTestId('box'));
    expect(hovering).toBe(false);
  });
});
