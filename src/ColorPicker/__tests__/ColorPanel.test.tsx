import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactElement } from 'react';

import { MotionProvider } from '@/MotionProvider';

import ColorPicker from '../ColorPicker';
import { clearRecentColors } from '../recent';

const renderPicker = (ui: ReactElement) =>
  render(<MotionProvider motion={motion}>{ui}</MotionProvider>);

const openPicker = () => fireEvent.click(screen.getByRole('button', { name: 'Pick colour' }));

const commit = (input: HTMLElement, value: string) => {
  fireEvent.change(input, { target: { value } });
  fireEvent.keyDown(input, { key: 'Enter' });
};

describe('ColorPicker panel', () => {
  afterEach(() => {
    cleanup();
    clearRecentColors();
  });

  test('the hex input is the only place the value is written out', () => {
    renderPicker(<ColorPicker defaultValue="#0072f5" />);

    openPicker();

    expect((screen.getByLabelText('HEX') as HTMLInputElement).value).toBe('0072F5');
    expect(screen.queryByText('#0072F5')).toBeNull();
  });

  test('the format select offers HEX, RGB and HSL', () => {
    renderPicker(<ColorPicker defaultValue="#0072f5" />);

    openPicker();

    expect(screen.getByRole('combobox', { name: 'Colour format' }).textContent).toContain('HEX');
  });

  test('RGB channels show the colour and commit edits', () => {
    const onChangeComplete = vi.fn();
    renderPicker(
      <ColorPicker
        defaultFormat="rgb"
        defaultValue="#0072f5"
        onChangeComplete={onChangeComplete}
      />,
    );

    openPicker();
    expect((screen.getByLabelText('R') as HTMLInputElement).value).toBe('0');
    expect((screen.getByLabelText('G') as HTMLInputElement).value).toBe('114');
    expect((screen.getByLabelText('B') as HTMLInputElement).value).toBe('245');

    commit(screen.getByLabelText('R'), '255');

    expect(onChangeComplete).toHaveBeenLastCalledWith('#ff72f5');
  });

  test('HSL channels show the colour and clamp out-of-range edits', () => {
    const onChangeComplete = vi.fn();
    renderPicker(
      <ColorPicker
        defaultFormat="hsl"
        defaultValue="#ff0000"
        onChangeComplete={onChangeComplete}
      />,
    );

    openPicker();
    expect((screen.getByLabelText('H') as HTMLInputElement).value).toBe('0');
    expect((screen.getByLabelText('S') as HTMLInputElement).value).toBe('100');
    expect((screen.getByLabelText('L') as HTMLInputElement).value).toBe('50');

    commit(screen.getByLabelText('L'), '400');

    expect(onChangeComplete).toHaveBeenLastCalledWith('#ffffff');
  });

  test('a committed colour shows up under Recent', () => {
    renderPicker(<ColorPicker defaultValue="#0072f5" presets={['#f4416c', '#379d4a']} />);

    openPicker();
    fireEvent.click(screen.getByRole('button', { name: '#379d4a' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Recent' }));

    expect(screen.getByRole('button', { name: '#379d4a' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '#f4416c' })).toBeNull();
  });

  test('without presets, recent colours show on their own', () => {
    renderPicker(<ColorPicker defaultValue="#0072f5" />);

    openPicker();
    expect(screen.queryByRole('tab')).toBeNull();
    commit(screen.getByLabelText('HEX'), '379d4a');

    expect(screen.getByRole('button', { name: '#379d4a' })).toBeTruthy();
  });

  test('the original swatch restores the colour the panel opened with', () => {
    const onChangeComplete = vi.fn();
    renderPicker(
      <ColorPicker
        defaultValue="#0072f5"
        presets={['#f4416c']}
        onChangeComplete={onChangeComplete}
      />,
    );

    openPicker();
    fireEvent.click(screen.getByRole('button', { name: '#f4416c' }));
    fireEvent.click(screen.getByRole('button', { name: 'Restore original colour' }));

    expect(onChangeComplete).toHaveBeenLastCalledWith('#0072f5');
  });
});

describe('ColorPicker triggers', () => {
  afterEach(cleanup);

  test('the field trigger shows alpha apart from the hex', () => {
    renderPicker(<ColorPicker alpha defaultValue="#0072f5cc" trigger="field" />);

    const trigger = screen.getByRole('button', { name: 'Pick colour' });

    expect(trigger.textContent).toContain('#0072F5');
    expect(trigger.textContent).toContain('80%');
    expect(trigger.textContent).not.toContain('CC');
  });

  test('showText is the field trigger', () => {
    renderPicker(<ColorPicker showText defaultValue="#0072f5" />);

    expect(screen.getByRole('button', { name: 'Pick colour' }).textContent).toContain('#0072F5');
  });

  test('the chip trigger shows the hex in a pill', () => {
    renderPicker(<ColorPicker defaultValue="#0072f5" trigger="chip" />);

    expect(screen.getByRole('button', { name: 'Pick colour' }).textContent).toContain('#0072F5');
  });

  test('an empty value reads as no colour', () => {
    renderPicker(<ColorPicker trigger="field" value="" />);

    expect(screen.getByRole('button', { name: 'Pick colour' }).textContent).toContain('No colour');
  });
});
