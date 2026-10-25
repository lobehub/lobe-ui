import { fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

import SplitButton from '../SplitButton';

describe('SplitButton', () => {
  test('mounts both spinners only while the group is loading', () => {
    const content = (loading: boolean) => (
      <ConfigProvider motion={motion}>
        <SplitButton loading={loading}>
          <SplitButton.Main>Save</SplitButton.Main>
          <SplitButton.Menu items={[{ key: 'download', label: 'Download' }]} />
        </SplitButton>
      </ConfigProvider>
    );
    const { rerender } = render(content(false));
    const slots = screen
      .getAllByRole('button')
      .map((button) => button.querySelector('.lobe-button__spinner'));

    expect(slots).toHaveLength(2);

    for (const loading of [false, true, false, true]) {
      rerender(content(loading));

      screen.getAllByRole('button').forEach((button, index) => {
        expect(button.querySelector('.lobe-button__spinner')).toBe(slots[index]);
        expect(slots[index]?.getAttribute('aria-hidden')).toBe(String(!loading));
        expect(Boolean(slots[index]?.firstElementChild)).toBe(loading);
      });
    }
  });

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
