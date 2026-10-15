import { fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { MotionProvider } from '@/MotionProvider';

import ControlInput from './ControlInput';

const renderWithMotion = (ui: ReactNode) =>
  render(<MotionProvider motion={motion}>{ui}</MotionProvider>);

const actionButtons = () => screen.queryAllByRole('button');

const typeInto = (value: string) =>
  fireEvent.change(screen.getByRole('textbox'), { target: { value } });

describe('ControlInput', () => {
  it('shows reset and submit only after the value changes', () => {
    renderWithMotion(<ControlInput value="saved" />);
    expect(actionButtons()).toHaveLength(0);
    typeInto('edited');
    expect(actionButtons()).toHaveLength(2);
  });

  it('submits the latest typed value', () => {
    const onChange = vi.fn();
    const onChangeEnd = vi.fn();
    renderWithMotion(<ControlInput value="saved" onChange={onChange} onChangeEnd={onChangeEnd} />);
    typeInto('first');
    typeInto('second');
    fireEvent.click(actionButtons()[1]);
    expect(onChange).toHaveBeenCalledWith('second');
    expect(onChangeEnd).toHaveBeenCalledWith('second');
  });

  it('resets to the saved value', () => {
    renderWithMotion(<ControlInput value="saved" />);
    typeInto('edited');
    fireEvent.click(actionButtons()[0]);
    expect(screen.getByRole<HTMLInputElement>('textbox').value).toBe('saved');
  });
});
