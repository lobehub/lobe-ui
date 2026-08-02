import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { __resetToastHostRegistryForTests } from './hostGuard';
import { __resetToastStateForTests, toast, ToastHost } from './imperative';

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
