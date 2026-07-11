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

  test('keeps tag order when adding a duplicate and removes a tag from its close control', () => {
    const ControlledTags = () => {
      const [value, setValue] = useState<string[]>([]);

      return (
        <>
          <ConfigProvider motion={motion}>
            <Select
              mode="tags"
              open={false}
              value={value}
              onChange={(nextValue) => setValue(Array.isArray(nextValue) ? nextValue : [])}
            />
          </ConfigProvider>
          <output data-testid="tags-value">{JSON.stringify(value)}</output>
        </>
      );
    };

    render(<ControlledTags />);

    const input = screen.getByRole('textbox');
    for (const tag of ['first', 'second', 'third', 'second']) {
      fireEvent.change(input, { target: { value: tag } });
      fireEvent.keyDown(input, { key: 'Enter' });
    }

    const trigger = screen.getByRole('combobox');
    expect(screen.getByTestId('tags-value').textContent).toBe('["first","second","third"]');
    expect(trigger.querySelectorAll('[data-role="lobe-select-tag"]')).toHaveLength(3);
    expect(trigger.textContent).toContain('first');
    expect(trigger.textContent).toContain('second');
    expect(trigger.textContent).toContain('third');

    fireEvent.click(trigger.querySelectorAll('[data-role="lobe-select-tag-remove"]')[1]);

    expect(trigger.textContent).toContain('first');
    expect(trigger.textContent).not.toContain('second');
    expect(trigger.textContent).toContain('third');
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
