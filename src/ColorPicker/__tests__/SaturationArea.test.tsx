import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import SaturationArea from '../SaturationArea';

describe('SaturationArea', () => {
  afterEach(cleanup);

  test('arrow keys move saturation and brightness by 1%, shift by 10%', () => {
    const onChange = vi.fn();
    const onChangeComplete = vi.fn();
    render(
      <SaturationArea
        hue={210}
        label="Colour"
        saturation={0.5}
        value={0.5}
        onChange={onChange}
        onChangeComplete={onChangeComplete}
      />,
    );
    const slider = screen.getByRole('slider', { name: 'Colour' });

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith(0.51, 0.5);

    fireEvent.keyDown(slider, { key: 'ArrowUp', shiftKey: true });
    expect(onChange).toHaveBeenLastCalledWith(0.5, 0.6);
    expect(onChangeComplete).toHaveBeenCalledTimes(2);
  });

  test('describes both axes', () => {
    render(
      <SaturationArea
        hue={0}
        label="Colour"
        saturation={0.25}
        value={0.75}
        onChange={vi.fn()}
        onChangeComplete={vi.fn()}
      />,
    );

    expect(screen.getByRole('slider').getAttribute('aria-valuetext')).toBe(
      'Saturation 25%, brightness 75%',
    );
  });
});
