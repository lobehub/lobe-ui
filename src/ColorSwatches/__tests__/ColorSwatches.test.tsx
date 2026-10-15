import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import ColorSwatches from '../ColorSwatches';
import type { ColorSwatchesPickerRenderProps } from '../type';

const colors = [
  { color: '#f4416c', title: 'Red' },
  { color: '#0072f5', title: 'Blue' },
];

describe('ColorSwatches custom colour', () => {
  afterEach(cleanup);

  test('shows only the add button while a preset is selected', () => {
    render(<ColorSwatches enableColorPicker colors={colors} value="#0072f5" />);

    expect(screen.getByRole('button', { name: 'Custom' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '#7c5cff' })).toBeNull();
  });

  test('appends a chip for the custom colour and keeps the add button', () => {
    render(<ColorSwatches enableColorPicker colors={colors} value="#7c5cff" />);

    const chip = screen.getByRole('button', { name: '#7c5cff' });
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    expect(chip.style.background).toContain('124, 92, 255');
    expect(screen.getByRole('button', { name: 'Custom' })).toBeTruthy();
  });

  test('drops the chip once a preset is picked again', () => {
    const { container } = render(
      <ColorSwatches enableColorPicker colors={colors} defaultValue="#7c5cff" />,
    );

    fireEvent.click(container.querySelector('[style*="244, 65, 108"]')!);

    expect(screen.queryByRole('button', { name: '#7c5cff' })).toBeNull();
  });

  test('renderPicker replaces the built-in picker and drives the selection', () => {
    const onChange = vi.fn();
    const calls: ColorSwatchesPickerRenderProps[] = [];
    render(
      <ColorSwatches
        enableColorPicker
        colors={colors}
        defaultValue="#0072f5"
        renderPicker={(props) => {
          calls.push(props);
          return (
            <button type="button" onClick={() => props.onChange('#7c5cff')}>
              Brand
            </button>
          );
        }}
        onChange={onChange}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Custom' })).toBeNull();
    expect(calls.at(-1)).toMatchObject({
      active: false,
      presets: ['#f4416c', '#0072f5'],
      shape: 'circle',
      size: 24,
      value: undefined,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Brand' }));

    expect(onChange.mock.lastCall?.[0]).toBe('#7c5cff');
    expect(calls.at(-1)).toMatchObject({ active: true, value: '#7c5cff' });
  });

  test('renderPicker can wrap the built-in picker', () => {
    render(
      <ColorSwatches
        enableColorPicker
        colors={colors}
        renderPicker={(_, picker) => <div data-testid="wrapper">{picker}</div>}
      />,
    );

    const wrapper = screen.getByTestId('wrapper');
    expect(wrapper.querySelector('button[aria-label="Custom"]')).toBeTruthy();
  });

  test('renderPicker is ignored while the picker is disabled', () => {
    const renderPicker = vi.fn(() => null);
    render(<ColorSwatches colors={colors} renderPicker={renderPicker} />);

    expect(renderPicker).not.toHaveBeenCalled();
  });
});
