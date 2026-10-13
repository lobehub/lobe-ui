import { render } from '@testing-library/react';

import Grainient, { hexToRgb } from './Grainient';

describe('Grainient', () => {
  test('parses 3- and 6-digit hex and falls back to white', () => {
    expect(hexToRgb('#ff0000')).toEqual([1, 0, 0]);
    expect(hexToRgb('#0f0')).toEqual([0, 1, 0]);
    expect(hexToRgb('nope')).toEqual([1, 1, 1]);
  });

  test('renders an empty layer without WebGL2', () => {
    const { container } = render(<Grainient />);
    expect(container.querySelector('[aria-hidden]')).toBeTruthy();
    expect(container.querySelector('canvas')).toBeNull();
  });
});
