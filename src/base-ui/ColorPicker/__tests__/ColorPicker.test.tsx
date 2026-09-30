import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import ColorPicker from '../ColorPicker';

const openPicker = () => fireEvent.click(screen.getByRole('button', { name: 'Pick colour' }));

describe('ColorPicker', () => {
  afterEach(cleanup);

  test('shows the hex headline for the current value', () => {
    render(<ColorPicker defaultValue="#0072f5" />);

    openPicker();

    expect(screen.getByText('#0072F5')).toBeTruthy();
  });

  test('presets emit onChange and onChangeComplete', () => {
    const onChange = vi.fn();
    const onChangeComplete = vi.fn();
    render(
      <ColorPicker
        defaultValue="#0072f5"
        presets={['#f4416c']}
        onChange={onChange}
        onChangeComplete={onChangeComplete}
      />,
    );

    openPicker();
    fireEvent.click(screen.getByRole('button', { name: '#f4416c' }));

    expect(onChange).toHaveBeenLastCalledWith('#f4416c', expect.anything());
    expect(onChangeComplete).toHaveBeenLastCalledWith('#f4416c');
  });

  test('keyboard on the saturation area emits while moving and completes', () => {
    const onChange = vi.fn();
    const onChangeComplete = vi.fn();
    render(
      <ColorPicker
        defaultValue="#808080"
        onChange={onChange}
        onChangeComplete={onChangeComplete}
      />,
    );

    openPicker();
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Saturation and brightness' }), {
      key: 'ArrowRight',
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChangeComplete).toHaveBeenCalledTimes(1);
  });

  test('alpha mode emits 8-digit hex', () => {
    const onChangeComplete = vi.fn();
    render(
      <ColorPicker
        alpha
        defaultValue="#0072f5"
        presets={['#f4416c']}
        onChangeComplete={onChangeComplete}
      />,
    );

    openPicker();
    fireEvent.click(screen.getByRole('button', { name: '#f4416c' }));

    expect(onChangeComplete).toHaveBeenLastCalledWith('#f4416cff');
  });

  test('hex input commits on Enter and ignores invalid text', () => {
    const onChangeComplete = vi.fn();
    render(<ColorPicker defaultValue="#0072f5" onChangeComplete={onChangeComplete} />);

    openPicker();
    const input = screen.getByLabelText('HEX');
    fireEvent.change(input, { target: { value: 'zzz' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChangeComplete).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '379D4A' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChangeComplete).toHaveBeenLastCalledWith('#379d4a');
  });

  test('opening moves focus to the saturation area', async () => {
    render(<ColorPicker defaultValue="#0072f5" />);

    openPicker();

    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe('Saturation and brightness'),
    );
  });

  test('the showText trigger sizes to its content', () => {
    render(<ColorPicker showText defaultValue="#0072f5" />);

    expect(getComputedStyle(screen.getByRole('button', { name: 'Pick colour' })).width).not.toBe(
      '100%',
    );
  });
});
