import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { useState } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Select from '../Select';

const options = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
];

const renderOpenSelect = (props: Record<string, any> = {}) => {
  const onOpenChange = vi.fn();
  const Wrapper = () => {
    const [open, setOpen] = useState(true);
    return (
      <ConfigProvider motion={motion}>
        <Select
          showSearch
          open={open}
          options={options}
          onOpenChange={(next: boolean) => {
            onOpenChange(next);
            setOpen(next);
          }}
          {...props}
        />
      </ConfigProvider>
    );
  };
  render(<Wrapper />);
  return onOpenChange;
};

describe('Select search during IME composition', () => {
  afterEach(cleanup);

  test('escape while composing keeps the popup open; a plain escape closes it', () => {
    const onOpenChange = renderOpenSelect();
    const input = screen.getByRole('textbox');

    act(() => {
      fireEvent.keyDown(input, { isComposing: true, key: 'Escape' });
      fireEvent.keyDown(input, { key: 'Escape', keyCode: 229 });
    });
    expect(onOpenChange).not.toHaveBeenCalledWith(false);

    act(() => {
      fireEvent.keyDown(input, { key: 'Escape' });
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test('tags: enter that confirms a composition does not add a tag', () => {
    const onChange = vi.fn();
    renderOpenSelect({ mode: 'tags', onChange });
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '中文' } });
    act(() => {
      fireEvent.keyDown(input, { isComposing: true, key: 'Enter' });
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});
