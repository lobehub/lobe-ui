import { fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

import SplitButton from '../SplitButton';

describe('SplitButton', () => {
  test('disables both actions and prevents the menu from opening', () => {
    const handleOpenChange = vi.fn();

    render(
      <ConfigProvider motion={motion}>
        <SplitButton disabled type={'primary'}>
          <SplitButton.Main>Save</SplitButton.Main>
          <SplitButton.Menu
            items={[{ key: 'download', label: 'Download' }]}
            onOpenChange={handleOpenChange}
          />
        </SplitButton>
      </ConfigProvider>,
    );

    const buttons = screen.getAllByRole('button') as HTMLButtonElement[];

    expect(buttons).toHaveLength(2);
    expect(buttons.every((button) => button.disabled)).toBe(true);

    fireEvent.click(buttons[1]);

    expect(handleOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  test.each([
    [{ danger: true }, cssVar.colorError],
    [{ ghost: true }, 'transparent'],
  ])('a primary group item with %o keeps its own resting fill', (itemProps, expected) => {
    render(
      <ConfigProvider motion={motion}>
        <SplitButton type={'primary'}>
          <SplitButton.Main {...itemProps}>Save</SplitButton.Main>
          <SplitButton.Menu items={[{ key: 'download', label: 'Download' }]} />
        </SplitButton>
      </ConfigProvider>,
    );

    const fill = getComputedStyle(screen.getByRole('button', { name: 'Save' })).backgroundColor;

    expect(fill.replaceAll(' ', '')).toBe(`var(--lobe-split-button-fill,${expected})`);
  });
});
