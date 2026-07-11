import { fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { useState } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Select from '../Select';

describe('Select tags mode', () => {
  test('adds multiple tags and removes the last tag with Backspace', () => {
    const onChange = vi.fn();
    const ControlledTags = () => {
      const [value, setValue] = useState<string[]>([]);

      return (
        <ConfigProvider motion={motion}>
          <Select
            mode="tags"
            open={false}
            value={value}
            onChange={(nextValue) => {
              onChange(nextValue);
              setValue(Array.isArray(nextValue) ? nextValue : []);
            }}
          />
        </ConfigProvider>
      );
    };

    render(<ControlledTags />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'first' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.change(input, { target: { value: 'second' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange.mock.calls.map(([nextValue]) => nextValue)).toEqual([
      ['first'],
      ['first', 'second'],
    ]);
    expect(screen.getByRole('combobox').textContent).toContain('first');
    expect(screen.getByRole('combobox').textContent).toContain('second');

    fireEvent.keyDown(input, { key: 'Backspace' });

    expect(screen.getByRole('combobox').textContent).toContain('first');
    expect(screen.getByRole('combobox').textContent).not.toContain('second');
  });

  test('lets the inline input use the full width when there are no tags', () => {
    render(
      <ConfigProvider motion={motion}>
        <Select mode="tags" open={false} placeholder="Add tags" />
      </ConfigProvider>,
    );

    const value = screen.getByRole('combobox').querySelector('span[data-placeholder]');

    expect(getComputedStyle(value!).flex).toBe('0 0 auto');
  });

  test('accepts a tag while the popup is controlled closed', () => {
    const onChange = vi.fn();

    render(
      <ConfigProvider motion={motion}>
        <Select mode="tags" open={false} placeholder="Add tags" onChange={onChange} />
      </ConfigProvider>,
    );

    const input = screen.getByPlaceholderText('Add tags');
    fireEvent.change(input, { target: { value: 'benchmark' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(
      ['benchmark'],
      [expect.objectContaining({ label: 'benchmark', value: 'benchmark' })],
    );
  });
});
