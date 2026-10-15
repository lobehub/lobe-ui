import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { __resetToastHostRegistryForTests } from './hostGuard';
import { __resetToastStateForTests, toast, ToastHost } from './imperative';

const titles = () => [...document.querySelectorAll('h2')].map((el) => el.textContent);

const show = (options: Parameters<typeof toast.error>[0]) => {
  act(() => {
    toast.error(options);
  });
};

beforeEach(() => {
  __resetToastHostRegistryForTests();
  __resetToastStateForTests();
});

afterEach(() => {
  __resetToastHostRegistryForTests();
  __resetToastStateForTests();
});

describe('toast dedupe by id', () => {
  it('replaces the toast in place when the same id is shown again', () => {
    render(<ToastHost />);

    show({ id: 'network', title: 'first' });
    show({ id: 'network', title: 'second' });

    expect(titles()).toEqual(['second']);
  });

  it('keeps toasts with distinct ids stacked', () => {
    render(<ToastHost />);

    show({ id: 'a', title: 'a' });
    show({ id: 'b', title: 'b' });

    expect(titles()).toEqual(['b', 'a']);
  });

  it('moves a repeated toast back to the front of the stack', () => {
    render(<ToastHost />);

    show({ id: 'a', title: 'a' });
    show({ id: 'b', title: 'b' });
    show({ id: 'a', title: 'a again' });

    expect(titles()).toEqual(['a again', 'b']);
  });

  it('does not report a close or removal when a toast is superseded', () => {
    render(<ToastHost />);

    const onClose = vi.fn();
    const onRemove = vi.fn();

    show({ id: 'a', onClose, onRemove, title: 'a' });
    show({ id: 'b', title: 'b' });
    show({ id: 'a', title: 'a again' });

    expect(onClose).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('still reports a close for a superseded toast once it is dismissed for real', () => {
    render(<ToastHost />);

    const onClose = vi.fn();

    show({ id: 'a', onClose, title: 'a' });
    show({ id: 'b', title: 'b' });
    show({ id: 'a', onClose, title: 'a again' });

    act(() => {
      toast.dismiss('a');
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('leaves toasts without an id untouched', () => {
    render(<ToastHost />);

    show({ title: 'same' });
    show({ title: 'same' });

    expect(titles()).toEqual(['same', 'same']);
  });
});
