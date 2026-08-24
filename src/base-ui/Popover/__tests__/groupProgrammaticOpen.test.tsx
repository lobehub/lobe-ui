/**
 * @vitest-environment jsdom
 */
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ConfigProvider from '@/ConfigProvider';

import { usePopoverGroupHandle } from '../groupContext';
import Popover from '../Popover';
import PopoverGroup from '../PopoverGroup';

vi.mock('antd-style', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd-style')>();
  return {
    ...actual,
    createStaticStyles: vi.fn((fn: any) => {
      const result = fn({ css: () => '', cssVar: {} });
      return new Proxy(result, {
        get: (target, key) => target[key as keyof typeof target] || '',
      });
    }),
  };
});

const renderWithProvider = (node: ReactNode) =>
  render(<ConfigProvider motion={motion}>{node}</ConfigProvider>);

const OpenByIdButton = ({ targetId }: { targetId: string }) => {
  const handle = usePopoverGroupHandle();

  return (
    <button type="button" onClick={() => handle?.open(targetId)}>
      open-remotely
    </button>
  );
};

describe('PopoverGroup programmatic open', () => {
  afterEach(() => {
    cleanup();
  });

  it('forwards triggerProps to the grouped trigger', () => {
    renderWithProvider(
      <PopoverGroup>
        <Popover content={<div>card</div>} triggerProps={{ id: 'row-1' }}>
          <button type="button">row</button>
        </Popover>
      </PopoverGroup>,
    );

    expect(screen.getByRole('button', { name: 'row' }).id).toBe('row-1');
  });

  it('opens a grouped popover by trigger id through the group handle', async () => {
    renderWithProvider(
      <PopoverGroup>
        <Popover content={<div>card-1</div>} trigger="click" triggerProps={{ id: 'row-1' }}>
          <button type="button">row-1</button>
        </Popover>
        <Popover content={<div>card-2</div>} trigger="click" triggerProps={{ id: 'row-2' }}>
          <button type="button">row-2</button>
        </Popover>
        <OpenByIdButton targetId="row-2" />
      </PopoverGroup>,
    );

    expect(screen.queryByText('card-2')).toBeNull();

    await act(async () => {
      screen.getByRole('button', { name: 'open-remotely' }).click();
    });

    await waitFor(() => {
      expect(screen.getByText('card-2')).toBeTruthy();
    });

    expect(screen.queryByText('card-1')).toBeNull();
  });

  it('returns null outside a group so callers can fall back', () => {
    const seen: unknown[] = [];
    const Probe = () => {
      seen.push(usePopoverGroupHandle());
      return null;
    };

    renderWithProvider(<Probe />);

    expect(seen).toEqual([null]);
  });
});
