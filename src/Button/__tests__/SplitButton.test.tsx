import { act, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

import SplitButton from '../SplitButton';

const getSpinner = (slot: Element | null) => slot?.firstElementChild?.firstElementChild ?? null;

describe('SplitButton', () => {
  test('cleans up both spinners without a width transition across repeated changes', async () => {
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
      await act(async () => rerender(content(loading)));

      screen.getAllByRole('button').forEach((button, index) => {
        expect(button.querySelector('.lobe-button__spinner')).toBe(slots[index]);
        expect(slots[index]?.getAttribute('aria-hidden')).toBe(String(!loading));
        expect(Boolean(getSpinner(slots[index]))).toBe(loading);
      });
    }
  });

  test('keeps each exiting spinner until its own width transition finishes', async () => {
    const content = (loading: boolean) => (
      <ConfigProvider motion={motion}>
        <SplitButton loading={loading}>
          <SplitButton.Main>Save</SplitButton.Main>
          <SplitButton.Menu items={[{ key: 'download', label: 'Download' }]} />
        </SplitButton>
      </ConfigProvider>
    );
    const { rerender } = render(content(true));
    const slots = screen
      .getAllByRole('button')
      .map((button) => button.querySelector('.lobe-button__spinner')!);
    const spinners = slots.map((slot) => getSpinner(slot));
    const exits = slots.map(() => Promise.withResolvers<void>());
    slots.forEach((slot, index) => {
      Object.defineProperty(slot, 'getAnimations', {
        value: () => [{ finished: exits[index].promise, transitionProperty: 'width' }],
      });
    });

    rerender(content(false));
    expect(slots.map((slot) => getSpinner(slot))).toEqual(spinners);

    await act(async () => exits[0].resolve());
    expect(getSpinner(slots[0])).toBeNull();
    expect(getSpinner(slots[1])).toBe(spinners[1]);

    await act(async () => exits[1].resolve());
    expect(getSpinner(slots[1])).toBeNull();
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
