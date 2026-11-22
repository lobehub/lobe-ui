import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { motion } from 'motion/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { MotionProvider } from '@/MotionProvider';

import EmojiPicker from './EmojiPicker';
import type { EmojiPickerCustomTab } from './type';

const tab = (value: string, placement?: 'start' | 'end'): EmojiPickerCustomTab => ({
  label: value,
  placement,
  render: () => <div>{`${value} content`}</div>,
  value,
});

const open = (customTabs: EmojiPickerCustomTab[], allowEmoji?: boolean) =>
  render(
    <MotionProvider motion={motion}>
      <EmojiPicker defaultOpen allowEmoji={allowEmoji} customTabs={customTabs} />
    </MotionProvider>,
  );

describe('EmojiPicker custom tabs', () => {
  beforeAll(() => {
    // emoji-mart observes its category sections, which jsdom cannot do.
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        disconnect() {}
        observe() {}
        unobserve() {}
      },
    );
  });

  it('puts a start tab first and opens on it', async () => {
    open([tab('after'), tab('before', 'start')]);

    const labels = (await screen.findAllByRole('tab')).map((item) => item.textContent);
    expect(labels[0]).toBe('before');
    expect(labels.at(-1)).toBe('after');
    expect(screen.getByText('before content')).toBeTruthy();
  });

  it('keeps custom tabs after the built-in ones by default', async () => {
    open([tab('after')]);

    const labels = (await screen.findAllByRole('tab')).map((item) => item.textContent);
    expect(labels.at(-1)).toBe('after');
    expect(labels).toHaveLength(2);
    expect(screen.queryByText('after content')).toBeNull();
  });

  it('shows a single remaining tab without the tab bar', async () => {
    open([tab('only')], false);

    expect(await screen.findByText('only content')).toBeTruthy();
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });

  it('keeps the emoji grid when no other tab could replace it', async () => {
    const { baseElement } = open([], false);

    await screen.findByRole('dialog').catch(() => null);
    expect(baseElement.querySelector('.lobe-emoji-picker')).not.toBeNull();
    expect(baseElement.querySelector('em-emoji-picker')).not.toBeNull();
  });

  it('stays open for a keepOpen change and closes for a plain one', async () => {
    const onChange = vi.fn();
    const buttons: EmojiPickerCustomTab = {
      label: 'picks',
      placement: 'start',
      render: (change) => (
        <>
          <button onClick={() => change('a', { keepOpen: true })}>keep</button>
          <button onClick={() => change('b')}>close</button>
        </>
      ),
      value: 'picks',
    };
    render(
      <MotionProvider motion={motion}>
        <EmojiPicker defaultOpen customTabs={[buttons]} onChange={onChange} />
      </MotionProvider>,
    );

    fireEvent.click(await screen.findByText('keep'));
    expect(onChange).toHaveBeenLastCalledWith('a', expect.anything());
    expect(screen.getByText('keep')).toBeTruthy();

    fireEvent.click(screen.getByText('close'));
    expect(onChange).toHaveBeenLastCalledWith('b', 'a');
    await waitFor(() => expect(screen.queryByText('keep')).toBeNull());
  });
});
