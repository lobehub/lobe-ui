import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Rate from '../Rate';

const fillWidths = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLElement>('[data-index]')].map(
    (star) => (star.children[1] as HTMLElement).style.width,
  );

describe('Rate', () => {
  afterEach(cleanup);

  test('read-only renders fractional fill and an accessible label', () => {
    const { container } = render(<Rate readOnly value={4.3} />);

    expect(screen.getByRole('img', { name: '4.3 out of 5' })).toBeTruthy();
    const widths = fillWidths(container).map((width) => Number.parseFloat(width));
    expect(widths.slice(0, 4)).toEqual([100, 100, 100, 100]);
    expect(widths[4]).toBeCloseTo(30);
  });

  test('half value fills half a star', () => {
    const { container } = render(<Rate allowHalf readOnly value={3.5} />);

    expect(fillWidths(container)).toEqual(['100%', '100%', '100%', '50%', '0%']);
  });

  test('clicking a star sets the value', () => {
    const onChange = vi.fn();
    const { container } = render(<Rate onChange={onChange} />);

    fireEvent.click(container.querySelector('[data-value="4"]')!);

    expect(onChange).toHaveBeenCalledWith(4, 0);
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('4');
  });

  test('hover previews and leaving restores', () => {
    const { container } = render(<Rate allowHalf defaultValue={1} />);

    fireEvent.pointerEnter(container.querySelector('[data-value="2.5"]')!);
    expect(fillWidths(container)).toEqual(['100%', '100%', '50%', '0%', '0%']);

    fireEvent.pointerLeave(screen.getByRole('slider'));
    expect(fillWidths(container)).toEqual(['100%', '0%', '0%', '0%', '0%']);
  });

  test('arrow keys step by half when allowHalf', () => {
    const onChange = vi.fn();
    render(<Rate allowHalf defaultValue={3} onChange={onChange} />);
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider.getAttribute('aria-valuenow')).toBe('3.5');
    expect(slider.getAttribute('aria-valuetext')).toBe('3.5 out of 5');

    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(slider.getAttribute('aria-valuenow')).toBe('2.5');

    fireEvent.keyDown(slider, { key: 'End' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider.getAttribute('aria-valuenow')).toBe('5');
    expect(onChange).toHaveBeenLastCalledWith(5, 2.5);
  });

  test('disabled ignores input', () => {
    const onChange = vi.fn();
    const { container } = render(<Rate disabled defaultValue={2} onChange={onChange} />);
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });

    expect(slider.getAttribute('aria-disabled')).toBe('true');
    expect(container.querySelector('[data-value]')).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });
});
