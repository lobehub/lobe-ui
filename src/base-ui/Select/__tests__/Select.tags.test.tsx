import { fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';

import Select from '../Select';

describe('Select tags mode', () => {
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
