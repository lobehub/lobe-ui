import { render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';

import Slider from '../Slider';

describe('Slider', () => {
  test('renders a vertical capsule thumb', () => {
    render(
      <ConfigProvider motion={motion}>
        <Slider defaultValue={30} />
      </ConfigProvider>,
    );

    const thumb = screen.getByRole('slider').parentElement;
    expect(thumb).toBeTruthy();
    const style = getComputedStyle(thumb!);

    expect(style.width).toBe('8px');
    expect(style.height).toBe('16px');
    expect(style.borderRadius).toBe('100px');
  });
});
