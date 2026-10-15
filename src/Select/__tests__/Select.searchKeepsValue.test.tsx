import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { useState } from 'react';

import ConfigProvider from '@/ConfigProvider';

import { shouldIgnoreRootValueChange } from '../helpers';
import Select from '../Select';

const options = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' },
];

const renderSelect = (props: Record<string, any>, onChange = vi.fn()) => {
  const Wrapper = () => {
    const [value, setValue] = useState<any>(props.initialValue);
    const [open, setOpen] = useState(true);

    return (
      <ConfigProvider motion={motion}>
        <Select
          {...props}
          open={open}
          options={options}
          value={value}
          onOpenChange={setOpen}
          onChange={(next: any) => {
            onChange(next);
            setValue(next);
          }}
        />
        <button data-testid="close" type="button" onClick={() => setOpen(false)} />
      </ConfigProvider>
    );
  };
  render(<Wrapper />);
  return onChange;
};

const searchThenClose = (term: string) => {
  fireEvent.change(screen.getByRole('textbox'), { target: { value: term } });
  act(() => {
    fireEvent.click(screen.getByTestId('close'));
  });
};

describe('Select search keeps selected value', () => {
  afterEach(cleanup);

  test('single: a non-matching search does not call onChange and the value survives closing', () => {
    const onChange = renderSelect({ initialValue: 'alpha', showSearch: true });

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'zzz' } });
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(screen.getByTestId('close'));
    });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('combobox').textContent).toContain('Alpha');
  });

  test('multiple: selected values survive a non-matching search and closing', () => {
    const onChange = renderSelect({
      initialValue: ['alpha', 'beta'],
      mode: 'multiple',
      showSearch: true,
    });

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'gam' } });
    searchThenClose('zzz');

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('combobox').textContent).toContain('Alpha');
    expect(screen.getByRole('combobox').textContent).toContain('Beta');
  });

  test('tags: selected values survive searching and closing', () => {
    const onChange = renderSelect({ initialValue: ['alpha', 'custom'], mode: 'tags' });

    searchThenClose('zzz');

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('combobox').textContent).toContain('Alpha');
    expect(screen.getByRole('combobox').textContent).toContain('custom');
  });

  test('reason none is ignored while open or searching, but kept for closed typeahead', () => {
    const base = { mergedOpen: false, reason: 'none', searchValue: '' };

    expect(shouldIgnoreRootValueChange(base)).toBe(false);
    expect(shouldIgnoreRootValueChange({ ...base, mergedOpen: true })).toBe(true);
    expect(shouldIgnoreRootValueChange({ ...base, searchValue: 'zzz' })).toBe(true);
    expect(shouldIgnoreRootValueChange({ ...base, mergedOpen: true, reason: 'item-press' })).toBe(
      false,
    );
  });
});
