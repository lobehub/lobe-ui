import { act, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { type ReactNode, StrictMode } from 'react';

import ConfigProvider from '@/ConfigProvider';

import ImageComponent from '../Image';

vi.mock('antd-style', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd-style')>();
  return {
    ...actual,
    createStaticStyles: vi.fn((fn: any) => {
      const result = fn({ css: () => '', cssVar: new Proxy({}, { get: () => '' }) });
      return new Proxy(result, { get: (_target, key) => String(key) });
    }),
  };
});

const motionMock = vi.hoisted(() => ({
  pending: [] as { run: () => void; stopped: boolean }[],
}));

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  return {
    ...actual,
    animate: vi.fn((value: { set: (next: unknown) => void }, target: unknown, options?: any) => {
      const task = {
        run: () => {
          value.set(target);
          options?.onComplete?.();
        },
        stopped: false,
      };
      motionMock.pending.push(task);
      return { stop: () => (task.stopped = true) };
    }),
  };
});

const flushAnimations = () =>
  act(() => {
    const tasks = motionMock.pending.splice(0);
    for (const task of tasks) if (!task.stopped) task.run();
  });

class FakePreloader {
  static instances: FakePreloader[] = [];
  private handlers = new Map<string, Set<() => void>>();
  src = '';

  constructor() {
    FakePreloader.instances.push(this);
  }

  addEventListener(type: string, handler: () => void) {
    const set = this.handlers.get(type) ?? new Set();
    set.add(handler);
    this.handlers.set(type, set);
  }

  removeEventListener(type: string, handler: () => void) {
    this.handlers.get(type)?.delete(handler);
  }

  emit(type: string) {
    act(() => {
      for (const handler of this.handlers.get(type) ?? []) handler();
    });
  }
}

const VIEWPORT = { height: 768, width: 1024 };
const THUMB_RECT = { height: 150, left: 100, top: 50, width: 200 };

const setViewport = ({ height, width }: { height: number; width: number }) => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width, writable: true });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: height,
    writable: true,
  });
};

const stubRect = (element: HTMLElement, rect: Partial<DOMRect>) => {
  const resolved = { height: 0, left: 0, top: 0, width: 0, ...rect };
  element.getBoundingClientRect = () =>
    ({
      ...resolved,
      bottom: resolved.top + resolved.height,
      right: resolved.left + resolved.width,
      toJSON: () => resolved,
      x: resolved.left,
      y: resolved.top,
    }) as DOMRect;
};

const stubNatural = (element: HTMLImageElement, width: number, height: number) => {
  Object.defineProperty(element, 'naturalWidth', { configurable: true, value: width });
  Object.defineProperty(element, 'naturalHeight', { configurable: true, value: height });
};

const renderWithMotion = (node: ReactNode) =>
  render(<ConfigProvider motion={motion}>{node}</ConfigProvider>);

const getViewerImage = () => document.querySelector<HTMLImageElement>('.viewerImage');
const getBackdrop = () => document.querySelector<HTMLElement>('.viewerBackdrop');
const getPopup = () => document.querySelector<HTMLElement>('.viewerPopup');
const getCloseButton = () => document.querySelector<HTMLElement>('.viewerClose');

const openViewer = (alt = 'cat', rect: Partial<DOMRect> = THUMB_RECT) => {
  const thumbnail = screen.getByAltText(alt) as HTMLImageElement;
  stubNatural(thumbnail, 400, 300);
  stubRect(thumbnail, rect);
  fireEvent.click(thumbnail);
  return thumbnail;
};

const dismissViaImage = () => {
  fireEvent.click(getViewerImage() as HTMLElement);
  act(() => {
    vi.advanceTimersByTime(300);
  });
};

beforeEach(() => {
  vi.useFakeTimers();
  motionMock.pending.length = 0;
  FakePreloader.instances.length = 0;
  setViewport(VIEWPORT);
  vi.stubGlobal('Image', FakePreloader);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('opening', () => {
  it('opens a dialog showing the thumbnail source', () => {
    renderWithMotion(<ImageComponent alt="cat" src="https://example.com/cat.png" />);
    openViewer();

    expect(screen.getByRole('dialog')).toBeDefined();
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/cat.png');
  });

  it('never opens when preview is disabled', () => {
    renderWithMotion(
      <ImageComponent alt="cat" preview={false} src="https://example.com/cat.png" />,
    );
    fireEvent.click(screen.getByAltText('cat'));

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('lays the viewer image out at the fit rect', () => {
    renderWithMotion(<ImageComponent alt="cat" src="https://example.com/cat.png" />);
    openViewer();

    const image = getViewerImage() as HTMLImageElement;
    expect(image.style.width).toBe('400px');
    expect(image.style.height).toBe('300px');
    expect(image.style.left).toBe('312px');
    expect(image.style.top).toBe('234px');
  });

  it('starts the image at the thumbnail rect and springs it to identity', () => {
    renderWithMotion(<ImageComponent alt="cat" src="https://example.com/cat.png" />);
    openViewer();

    const image = getViewerImage() as HTMLImageElement;
    expect(image.style.transform).toBe(
      'translate3d(-312px, -259px, 0) scale(0.5) rotate(0deg) scaleX(1) scaleY(1)',
    );

    flushAnimations();
    expect(image.style.transform).toBe(
      'translate3d(0px, 0px, 0) scale(1) rotate(0deg) scaleX(1) scaleY(1)',
    );
  });

  it('fades in without a FLIP transform when motion is unavailable', () => {
    render(<ImageComponent alt="cat" src="https://example.com/cat.png" />);
    openViewer();

    const image = getViewerImage() as HTMLImageElement;
    expect(image.style.transform).toBe(
      'translate3d(0px, 0px, 0) scale(1) rotate(0deg) scaleX(1) scaleY(1)',
    );
    expect(image.style.opacity).toBe('0');

    flushAnimations();
    expect(image.style.opacity).toBe('1');
  });

  it('re-runs the fit computation when the viewport resizes', () => {
    renderWithMotion(<ImageComponent alt="cat" src="https://example.com/cat.png" />);
    openViewer();
    flushAnimations();

    act(() => {
      setViewport({ height: 400, width: 500 });
      fireEvent(window, new Event('resize'));
    });

    const image = getViewerImage() as HTMLImageElement;
    expect(image.style.width).toBe('400px');
    expect(image.style.height).toBe('300px');
    expect(image.style.left).toBe('50px');
    expect(image.style.top).toBe('50px');
  });
});

describe('closing', () => {
  it.each([
    ['the viewer image', dismissViaImage],
    ['the backdrop', () => fireEvent.click(getBackdrop() as HTMLElement)],
    ['the popup surface', () => fireEvent.click(getPopup() as HTMLElement)],
    ['the close button', () => fireEvent.click(getCloseButton() as HTMLElement)],
    ['Escape', () => fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' })],
  ])('closes and unmounts on %s', (_label, dismiss) => {
    renderWithMotion(<ImageComponent alt="cat" src="https://example.com/cat.png" />);
    openViewer();
    flushAnimations();

    dismiss();
    flushAnimations();

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('springs back to the thumbnail rect measured at close time', () => {
    renderWithMotion(<ImageComponent alt="cat" src="https://example.com/cat.png" />);
    const thumbnail = openViewer();
    flushAnimations();

    stubRect(thumbnail, { height: 150, left: 300, top: 250, width: 200 });
    const image = getViewerImage() as HTMLImageElement;
    dismissViaImage();
    flushAnimations();

    expect(image.style.transform).toBe(
      'translate3d(-112px, -59px, 0) scale(0.5) rotate(0deg) scaleX(1) scaleY(1)',
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('waits for every close axis to settle before unmounting, even when scale has nothing to animate', () => {
    renderWithMotion(<ImageComponent alt="cat" src="https://example.com/cat.png" />);
    const thumbnail = openViewer();
    flushAnimations();

    stubRect(thumbnail, { height: 300, left: 100, top: 50, width: 400 });
    fireEvent.click(getBackdrop() as HTMLElement);

    const scaleTask = motionMock.pending[4];
    act(() => {
      scaleTask.run();
    });
    expect(screen.queryByRole('dialog')).not.toBeNull();

    flushAnimations();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('fades out instead of springing back when the thumbnail is off screen', () => {
    renderWithMotion(<ImageComponent alt="cat" src="https://example.com/cat.png" />);
    const thumbnail = openViewer();
    flushAnimations();

    stubRect(thumbnail, { height: 150, left: 100, top: 4000, width: 200 });
    const image = getViewerImage() as HTMLImageElement;
    dismissViaImage();
    flushAnimations();

    expect(image.style.transform).toBe(
      'translate3d(0px, 0px, 0) scale(0.92) rotate(0deg) scaleX(1) scaleY(1)',
    );
    expect(image.style.opacity).toBe('0');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('focus restoration', () => {
  it('returns focus to the element focused before the thumbnail was clicked', async () => {
    renderWithMotion(
      <div>
        <button type="button">External</button>
        <ImageComponent alt="cat" src="https://example.com/cat.png" />
      </div>,
    );

    const externalButton = screen.getByText('External');
    externalButton.focus();
    expect(document.activeElement).toBe(externalButton);

    const thumbnail = screen.getByAltText('cat') as HTMLImageElement;
    stubNatural(thumbnail, 400, 300);
    stubRect(thumbnail, THUMB_RECT);
    fireEvent.pointerDown(thumbnail);
    // jsdom never replicates the browser's native mousedown-blurs-to-body
    // default action, so force it here — otherwise this test would pass even
    // without the captured-ref restoration wired up at all, since the button
    // would still happen to hold focus by the time the dialog closes.
    externalButton.blur();
    expect(document.activeElement).toBe(document.body);
    fireEvent.click(thumbnail);
    flushAnimations();

    expect(screen.getByRole('dialog')).toBeDefined();

    fireEvent.click(getBackdrop() as HTMLElement);
    flushAnimations();
    // Base UI's own focus restoration runs inside a queueMicrotask in the
    // FloatingFocusManager's unmount cleanup, which the synchronous
    // flushAnimations() above does not drain.
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(externalButton);
  });

  it('does not steal focus to the first tabbable element when nothing meaningful was focused beforehand', async () => {
    renderWithMotion(<ImageComponent alt="cat" src="https://example.com/cat.png" />);
    (document.activeElement as HTMLElement | null)?.blur();
    expect(document.activeElement).toBe(document.body);

    const thumbnail = screen.getByAltText('cat') as HTMLImageElement;
    stubNatural(thumbnail, 400, 300);
    stubRect(thumbnail, THUMB_RECT);
    fireEvent.pointerDown(thumbnail);
    fireEvent.click(thumbnail);
    flushAnimations();

    fireEvent.click(getBackdrop() as HTMLElement);
    flushAnimations();
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(document.body);
  });
});

describe('onOpenChange', () => {
  it('reports open at click time and close at dismissal', () => {
    const onOpenChange = vi.fn();
    renderWithMotion(
      <ImageComponent alt="cat" preview={{ onOpenChange }} src="https://example.com/cat.png" />,
    );

    openViewer();
    expect(onOpenChange.mock.calls).toEqual([[true]]);

    flushAnimations();
    dismissViaImage();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);

    flushAnimations();
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });
});

describe('singleton', () => {
  it('closes the previous viewer instantly when another image opens', () => {
    const onFirstOpenChange = vi.fn();
    renderWithMotion(
      <>
        <ImageComponent
          alt="cat"
          preview={{ onOpenChange: onFirstOpenChange }}
          src="https://example.com/cat.png"
        />
        <ImageComponent alt="dog" src="https://example.com/dog.png" />
      </>,
    );

    openViewer('cat');
    flushAnimations();
    openViewer('dog');

    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/dog.png');
    expect(onFirstOpenChange.mock.calls).toEqual([[true], [false]]);
  });
});

describe('owner unmount', () => {
  const Harness = ({
    onOpenChange,
    visible,
  }: {
    onOpenChange: (open: boolean) => void;
    visible: boolean;
  }) => (
    <ConfigProvider motion={motion}>
      {visible && (
        <ImageComponent alt="cat" preview={{ onOpenChange }} src="https://example.com/cat.png" />
      )}
      <ImageComponent alt="dog" src="https://example.com/dog.png" />
    </ConfigProvider>
  );

  it('releases the session when the owning image unmounts while open', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<Harness visible onOpenChange={onOpenChange} />);

    openViewer('cat');
    flushAnimations();
    rerender(<Harness visible={false} onOpenChange={onOpenChange} />);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);

    openViewer('dog');
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/dog.png');
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });

  it('reports the close only once when the owner unmounts mid close animation', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<Harness visible onOpenChange={onOpenChange} />);

    openViewer('cat');
    flushAnimations();
    dismissViaImage();
    rerender(<Harness visible={false} onOpenChange={onOpenChange} />);

    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it('keeps the viewer open under StrictMode remounts', () => {
    render(
      <StrictMode>
        <ConfigProvider motion={motion}>
          <ImageComponent alt="cat" src="https://example.com/cat.png" />
        </ConfigProvider>
      </StrictMode>,
    );

    openViewer();

    expect(screen.getByRole('dialog')).toBeDefined();
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/cat.png');
  });
});

describe('dual source', () => {
  it('swaps to the preview source once it preloads', () => {
    renderWithMotion(
      <ImageComponent
        alt="cat"
        preview={{ src: 'https://example.com/cat-hd.png' }}
        src="https://example.com/cat.png"
      />,
    );
    openViewer();

    const [preloader] = FakePreloader.instances;
    expect(preloader.src).toBe('https://example.com/cat-hd.png');
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/cat.png');

    preloader.emit('load');
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/cat-hd.png');
  });

  it('keeps the thumbnail source when the preview source fails', () => {
    renderWithMotion(
      <ImageComponent
        alt="cat"
        preview={{ src: 'https://example.com/cat-hd.png' }}
        src="https://example.com/cat.png"
      />,
    );
    openViewer();

    const [preloader] = FakePreloader.instances;
    preloader.emit('error');

    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/cat.png');
  });

  it('does not preload when the preview source matches the thumbnail', () => {
    renderWithMotion(
      <ImageComponent
        alt="cat"
        preview={{ src: 'https://example.com/cat.png' }}
        src="https://example.com/cat.png"
      />,
    );
    openViewer();

    expect(FakePreloader.instances).toHaveLength(0);
  });
});
