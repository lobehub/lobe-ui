import { render } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { Button, ConfigProvider, DropdownMenu, Popover, Tooltip } from '@/index';

const wrap = (ui: ReactNode) => render(<ConfigProvider motion={motion}>{ui}</ConfigProvider>);

const collectWarnings = () => {
  const messages: string[] = [];
  const push = (...args: unknown[]) => messages.push(args.map(String).join(' '));
  const error = vi.spyOn(console, 'error').mockImplementation(push);
  const warn = vi.spyOn(console, 'warn').mockImplementation(push);
  return {
    messages,
    restore: () => {
      error.mockRestore();
      warn.mockRestore();
    },
  };
};

const REF_WARNING = /element\.ref was removed/;
const NATIVE_WARNING = /nativeButton/;

describe('trigger cloning on React 19', () => {
  it('does not read element.ref and still forwards the child ref (Popover / Tooltip / DropdownMenu)', () => {
    const w = collectWarnings();
    const popoverRef = { current: null } as { current: HTMLButtonElement | null };
    const tooltipRef = { current: null } as { current: HTMLButtonElement | null };
    const menuRef = { current: null } as { current: HTMLButtonElement | null };
    wrap(
      <>
        <Popover content="c">
          <button ref={popoverRef} type="button">
            p
          </button>
        </Popover>
        <Tooltip title="t">
          <button ref={tooltipRef} type="button">
            t
          </button>
        </Tooltip>
        <DropdownMenu items={[{ key: 'a', label: 'A' }]}>
          <button ref={menuRef} type="button">
            m
          </button>
        </DropdownMenu>
      </>,
    );
    w.restore();
    expect(w.messages.filter((m) => REF_WARNING.test(m))).toEqual([]);
    expect(popoverRef.current?.tagName).toBe('BUTTON');
    expect(tooltipRef.current?.tagName).toBe('BUTTON');
    expect(menuRef.current?.tagName).toBe('BUTTON');
  });

  it('does not claim a native button for a Button rendered as a link', () => {
    const w = collectWarnings();
    wrap(
      <>
        <Popover content="c">
          <Button href="https://lobehub.com">link</Button>
        </Popover>
        <DropdownMenu items={[{ key: 'a', label: 'A' }]}>
          <Button href="https://lobehub.com">menu link</Button>
        </DropdownMenu>
      </>,
    );
    w.restore();
    expect(w.messages.filter((m) => NATIVE_WARNING.test(m))).toEqual([]);
  });
});
