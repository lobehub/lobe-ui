import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { __resetToastHostRegistryForTests } from './hostGuard';
import { __resetToastStateForTests, toast, ToastHost } from './imperative';
import { markToastHostNotReady, markToastHostReady } from './pendingQueue';

beforeEach(() => {
  __resetToastHostRegistryForTests();
  __resetToastStateForTests();
});

afterEach(() => {
  __resetToastHostRegistryForTests();
  __resetToastStateForTests();
});

describe('ToastHost single-instance guard', () => {
  it('standalone: a single mounted host renders toasts as before', async () => {
    render(<ToastHost />);

    await act(async () => {
      toast.success('solo');
    });

    expect(await screen.findAllByText('solo')).toHaveLength(1);
  });

  it('renders exactly one toast when two hosts are mounted together', async () => {
    render(
      <>
        <ToastHost />
        <ToastHost />
      </>,
    );

    await act(async () => {
      toast.success('hello');
    });

    expect(await screen.findAllByText('hello')).toHaveLength(1);
  });

  it('a later-mounted host stays silent, and toasts still land in the first-mounted host', async () => {
    render(<ToastHost />);
    const viewerHost = render(<ToastHost />);

    await act(async () => {
      toast.success('copied');
    });

    expect(await screen.findAllByText('copied')).toHaveLength(1);

    viewerHost.unmount();

    expect(screen.getAllByText('copied')).toHaveLength(1);
  });

  it('promotes the second host once the first (active) host unmounts', async () => {
    const globalHost = render(<ToastHost />);
    render(<ToastHost />);

    globalHost.unmount();

    await act(async () => {
      toast.success('after handoff');
    });

    expect(await screen.findAllByText('after handoff')).toHaveLength(1);
  });

  it('a toast fired after the viewer host has already unmounted still renders in the surviving global host', async () => {
    render(<ToastHost />);
    const viewerHost = render(<ToastHost />);

    viewerHost.unmount();

    await act(async () => {
      toast.success('copied after close');
    });

    expect(await screen.findAllByText('copied after close')).toHaveLength(1);
  });
});

describe('toasts fired during a handoff window are not lost', () => {
  // RTL's unmount() flushes React's effect cascade (unregister -> promote ->
  // remount -> subscribe -> ready) to completion inside its own act() before
  // returning, so a real live handoff never leaves an externally-observable
  // gap in this synchronous test harness. These tests instead exercise the
  // same runWhenToastHostReady/markToastHostReady primitives ToastHost's own
  // effect calls, constructing scenarios where "nothing is listening yet" is
  // genuinely true at the moment toast.success() runs.

  it('a toast fired before any host has ever mounted is queued and delivered once a host mounts', async () => {
    act(() => {
      toast.success('queued before any host');
    });
    expect(screen.queryAllByText('queued before any host')).toHaveLength(0);

    render(<ToastHost />);

    expect(await screen.findAllByText('queued before any host')).toHaveLength(1);
  });

  it('a toast fired while the active host is momentarily not ready is delivered exactly once when readiness is restored', async () => {
    render(<ToastHost />);

    act(() => {
      markToastHostNotReady();
      toast.success('mid-handoff');
    });
    expect(screen.queryAllByText('mid-handoff')).toHaveLength(0);

    act(() => {
      markToastHostReady();
    });

    expect(await screen.findAllByText('mid-handoff')).toHaveLength(1);
  });

  describe('TTL', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('drops a toast that sat queued past the TTL instead of delivering it once a host finally mounts', async () => {
      vi.useFakeTimers();

      toast.success('too stale');
      vi.advanceTimersByTime(6000);

      render(<ToastHost />);
      await act(async () => {});

      expect(screen.queryAllByText('too stale')).toHaveLength(0);
    });
  });
});
