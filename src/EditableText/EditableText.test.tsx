import { act, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { describe, expect, it, vi } from 'vitest';

import { MotionProvider } from '@/MotionProvider';

import EditableText from './EditableText';

describe('EditableText', () => {
  it('ignores escape while an IME is composing and stops editing on a plain escape', () => {
    const onEditingChange = vi.fn();
    render(
      <MotionProvider motion={motion}>
        <EditableText editing value="title" onEditingChange={onEditingChange} />
      </MotionProvider>,
    );
    const input = screen.getByRole('textbox');
    input.focus();

    const press = (init: Record<string, unknown> = {}) =>
      act(() => {
        fireEvent.keyDown(input, { code: 'Escape', key: 'Escape', ...init });
        fireEvent.keyUp(input, { code: 'Escape', key: 'Escape' });
      });

    press({ isComposing: true });
    press({ keyCode: 229 });
    expect(onEditingChange).not.toHaveBeenCalled();

    press();
    expect(onEditingChange).toHaveBeenCalledWith(false, true);
  });
});
