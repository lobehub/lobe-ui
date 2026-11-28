import { cleanup, render, screen } from '@testing-library/react';

import Slider from '../Slider';

describe('Slider variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders the label, the value with its unit and a slider', () => {
    const { container } = render(
      <Slider defaultValue={40} label="Opacity" max={100} unit="%" variant="a2ui" />,
    );
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBe('a2ui');
    expect(screen.getByText('Opacity')).toBeTruthy();
    expect(container.querySelector('.lobe-slider__value')?.textContent).toBe('40 %');
    expect(screen.getByRole('slider')).toBeTruthy();
  });

  test('without a label or unit the value is hidden', () => {
    const { container } = render(<Slider defaultValue={40} variant="a2ui" />);
    expect(container.querySelector('.lobe-slider__value')?.textContent).toBe('');
  });
});
