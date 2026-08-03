import { act, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

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

const VIEWPORT = { height: 768, width: 1024 };
const CENTER = { x: 512, y: 384 };
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

const renderWithMotion = (node: ReactNode) =>
  render(<ConfigProvider motion={motion}>{node}</ConfigProvider>);

const getViewerImage = () => document.querySelector<HTMLImageElement>('.viewerImage');
const getBackdrop = () => document.querySelector<HTMLElement>('.viewerBackdrop');
const getPopup = () => document.querySelector<HTMLElement>('.viewerPopup');
const getCloseButton = () => document.querySelector<HTMLElement>('.viewerClose');
const isOpen = () => screen.queryByRole('dialog') !== null;

const readTransform = () => {
  const transform = getViewerImage()?.style.transform ?? '';
  const scale = /scale\((-?[\d.]+)\)/.exec(transform);
  const translate = /translate3d\((-?[\d.]+)px, (-?[\d.]+)px/.exec(transform);
  return {
    scale: Number(scale?.[1]),
    x: Number(translate?.[1]),
    y: Number(translate?.[2]),
  };
};

const openViewer = (natural = { height: 300, width: 400 }) => {
  const thumbnail = screen.getByAltText('cat') as HTMLImageElement;
  Object.defineProperty(thumbnail, 'naturalWidth', { configurable: true, value: natural.width });
  Object.defineProperty(thumbnail, 'naturalHeight', { configurable: true, value: natural.height });
  stubRect(thumbnail, THUMB_RECT);
  fireEvent.click(thumbnail);
  flushAnimations();
  return thumbnail;
};

const mount = (natural?: { height: number; width: number }) => {
  renderWithMotion(<ImageComponent alt="cat" src="https://example.com/cat.png" />);
  return openViewer(natural);
};

const mountReporting = (onOpenChange: (open: boolean) => void) => {
  renderWithMotion(
    <ImageComponent alt="cat" preview={{ onOpenChange }} src="https://example.com/cat.png" />,
  );
  return openViewer();
};

const wheel = (init: { ctrlKey?: boolean; deltaY: number }) =>
  act(() => {
    getPopup()?.dispatchEvent(
      new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        clientX: CENTER.x,
        clientY: CENTER.y,
        ...init,
      }),
    );
  });

const pressKey = (key: string) => fireEvent.keyDown(document.body, { key });

const pressZoomKey = (key: string) => {
  pressKey(key);
  flushAnimations();
};

const settleDoubleClickWindow = () =>
  act(() => {
    vi.advanceTimersByTime(300);
  });

const AT_CENTER = { clientX: CENTER.x, clientY: CENTER.y };

const clickImage = (init = AT_CENTER) => fireEvent.click(getViewerImage() as HTMLElement, init);

const doubleClickImage = (init = AT_CENTER) => {
  const image = getViewerImage() as HTMLImageElement;
  fireEvent.click(image, init);
  fireEvent.click(image, { ...init, detail: 2 });
  fireEvent.doubleClick(image, init);
  flushAnimations();
};

beforeEach(() => {
  vi.useFakeTimers();
  motionMock.pending.length = 0;
  setViewport(VIEWPORT);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('wheel', () => {
  it('closes once accumulated deltaY at clean fit reaches the threshold', () => {
    mount();

    wheel({ deltaY: 60 });
    expect(isOpen()).toBe(true);

    wheel({ deltaY: 60 });
    flushAnimations();
    expect(isOpen()).toBe(false);
  });

  it('prevents default on wheel events raised over the image', () => {
    mount();
    const event = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 10 });
    act(() => {
      getViewerImage()?.dispatchEvent(event);
    });

    expect(event.defaultPrevented).toBe(true);
  });

  it('ctrl+wheel zooms at clean fit instead of closing', () => {
    mount();

    wheel({ ctrlKey: true, deltaY: -100 });

    expect(isOpen()).toBe(true);
    expect(readTransform().scale).toBeCloseTo(1.2214, 4);
  });

  it('zooms and never closes while zoomed, however far the wheel travels', () => {
    mount();
    wheel({ ctrlKey: true, deltaY: -100 });

    wheel({ deltaY: 60 });
    expect(readTransform().scale).toBeCloseTo(1.0833, 4);

    wheel({ deltaY: 60 });
    wheel({ deltaY: 60 });
    flushAnimations();

    expect(isOpen()).toBe(true);
    expect(readTransform().scale).toBe(1);
  });

  it('stays disarmed after a zoom-out overshoot until 300ms of wheel idle', () => {
    mount();

    wheel({ ctrlKey: true, deltaY: -100 });
    wheel({ deltaY: 400 });
    flushAnimations();
    expect(readTransform().scale).toBe(1);

    wheel({ deltaY: 150 });
    expect(isOpen()).toBe(true);

    act(() => {
      vi.advanceTimersByTime(300);
    });
    wheel({ deltaY: 150 });
    flushAnimations();

    expect(isOpen()).toBe(false);
  });

  it('detaches the wheel listener when the viewer unmounts', () => {
    mount();
    const popup = getPopup() as HTMLElement;
    const removeEventListener = vi.spyOn(popup, 'removeEventListener');

    fireEvent.click(popup);
    flushAnimations();

    expect(isOpen()).toBe(false);
    expect(removeEventListener).toHaveBeenCalledWith('wheel', expect.any(Function));
  });
});

describe('double click', () => {
  it('toggles between clean fit and the double click target', () => {
    mount();

    doubleClickImage();
    expect(readTransform()).toEqual({ scale: 2, x: 0, y: 0 });

    doubleClickImage();
    expect(readTransform()).toEqual({ scale: 1, x: 0, y: 0 });
    expect(isOpen()).toBe(true);
  });

  it('cancels the pending close when the second click lands inside the window', () => {
    mount();

    clickImage();
    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(isOpen()).toBe(true);

    fireEvent.click(getViewerImage() as HTMLElement, { ...AT_CENTER, detail: 2 });
    fireEvent.doubleClick(getViewerImage() as HTMLElement, AT_CENTER);
    settleDoubleClickWindow();
    flushAnimations();

    expect(isOpen()).toBe(true);
    expect(readTransform()).toEqual({ scale: 2, x: 0, y: 0 });
  });

  it('anchors the zoom at the cursor rather than the viewport centre', () => {
    mount({ height: 2000, width: 4000 });

    doubleClickImage({ clientX: 412, clientY: 384 });

    expect(readTransform().scale).toBeCloseTo(4.0984, 4);
    expect(readTransform().x).toBeCloseTo(309.836, 3);
  });
});

describe('pointer drag', () => {
  const drag = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const image = getViewerImage() as HTMLImageElement;
    fireEvent.pointerDown(image, { clientX: from.x, clientY: from.y, pointerId: 1 });
    fireEvent.pointerMove(image, { clientX: to.x, clientY: to.y, pointerId: 1 });
    fireEvent.pointerUp(image, { clientX: to.x, clientY: to.y, pointerId: 1 });
  };

  it('pans the zoomed image and keeps it open', () => {
    mount({ height: 2000, width: 4000 });
    doubleClickImage();

    drag({ x: 500, y: 400 }, { x: 450, y: 380 });

    expect(readTransform().x).toBe(-50);
    expect(readTransform().y).toBe(-20);
    expect(isOpen()).toBe(true);
  });

  it('lets the first pointer finish the pan when a second pointer joins', () => {
    mount({ height: 2000, width: 4000 });
    doubleClickImage();
    const image = getViewerImage() as HTMLImageElement;

    fireEvent.pointerDown(image, { clientX: 500, clientY: 400, pointerId: 1 });
    fireEvent.pointerMove(image, { clientX: 450, clientY: 400, pointerId: 1 });
    fireEvent.pointerDown(image, { clientX: 700, clientY: 300, pointerId: 2 });
    expect(image.style.cursor).toBe('grabbing');

    fireEvent.pointerUp(image, { clientX: 450, clientY: 400, pointerId: 1 });

    expect(image.style.cursor).toBe('grab');
    expect(readTransform().x).toBe(-50);
    expect(isOpen()).toBe(true);
  });

  it('suppresses the click-to-close when the pointer moved more than 4px', () => {
    mount();

    drag({ x: 500, y: 400 }, { x: 520, y: 400 });
    clickImage();
    settleDoubleClickWindow();
    flushAnimations();

    expect(isOpen()).toBe(true);
  });

  it('still closes when the pointer barely moved', () => {
    mount();

    drag({ x: 500, y: 400 }, { x: 502, y: 400 });
    clickImage();
    settleDoubleClickWindow();
    flushAnimations();

    expect(isOpen()).toBe(false);
  });

  it('keeps a plain click on the zoomed image from closing but not one on the backdrop', () => {
    mount({ height: 2000, width: 4000 });
    doubleClickImage();

    clickImage();
    settleDoubleClickWindow();
    flushAnimations();
    expect(isOpen()).toBe(true);

    fireEvent.click(getPopup() as HTMLElement);
    flushAnimations();
    expect(isOpen()).toBe(false);
  });
});

describe('escape layering', () => {
  it('resets a dirty viewer first and closes on the second press', () => {
    mount();
    wheel({ ctrlKey: true, deltaY: -100 });
    expect(readTransform().scale).toBeCloseTo(1.2214, 4);

    pressKey('Escape');
    flushAnimations();
    expect(isOpen()).toBe(true);
    expect(readTransform().scale).toBe(1);

    pressKey('Escape');
    flushAnimations();
    expect(isOpen()).toBe(false);
  });

  it('closes straight away from clean fit', () => {
    mount();

    pressKey('Escape');
    flushAnimations();

    expect(isOpen()).toBe(false);
  });

  it('does not let a second Esc during the close window cancel the close', () => {
    const onOpenChange = vi.fn();
    mountReporting(onOpenChange);

    pressKey('Escape');
    // Run only the scale axis's close animation, so scale now reads dirty
    // (target 0.5 for this thumbnail) while x/y are still pending — the
    // same live-mid-flight state a second Esc would see during a real close.
    // Splice it out first so flushAnimations() below doesn't re-run it.
    act(() => {
      const [scaleTask] = motionMock.pending.splice(4, 1);
      scaleTask.run();
    });

    const pendingBeforeSecondEsc = motionMock.pending.length;
    pressKey('Escape');
    // This mock never models motion's real cancel-on-restart semantics (see
    // useFlipTransition.test.ts for that), so a fresh reset() call here would
    // just queue alongside — not visibly break — the close. The real
    // regression is reset() firing at all: assert no new animations queued.
    expect(motionMock.pending.length).toBe(pendingBeforeSecondEsc);

    flushAnimations();

    expect(isOpen()).toBe(false);
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it('does not let a double-click during the close window override the close transform', () => {
    const onOpenChange = vi.fn();
    mountReporting(onOpenChange);

    pressKey('Escape');
    act(() => {
      const [scaleTask] = motionMock.pending.splice(4, 1);
      scaleTask.run();
    });

    // Dispatch the double-click without the helper's flushAnimations(): the
    // flush would run the remaining close axes and unmount the viewer, and
    // this test must stay frozen mid-close to observe the gate.
    const midClose = readTransform();
    const pendingBeforeDoubleClick = motionMock.pending.length;
    const image = getViewerImage() as HTMLImageElement;
    fireEvent.click(image, AT_CENTER);
    fireEvent.click(image, { ...AT_CENTER, detail: 2 });
    fireEvent.doubleClick(image, AT_CENTER);
    expect(readTransform()).toEqual(midClose);
    expect(motionMock.pending.length).toBe(pendingBeforeDoubleClick);

    flushAnimations();

    expect(isOpen()).toBe(false);
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it('does not let dragEnd during the close window queue an animation on top of the close', () => {
    const onOpenChange = vi.fn();
    mountReporting(onOpenChange);

    // Nudge just inside CLEAN_EPSILON of scale 1 — isZoomed (>1, so a drag
    // is panEligible) and isClean (within epsilon, so escIntent() reads
    // 'close' rather than 'reset') are simultaneously true, the sliver that
    // makes a real close reachable while a pan is still in flight.
    wheel({ ctrlKey: true, deltaY: -2 });
    const scaleAfterNudge = readTransform().scale;
    expect(scaleAfterNudge).toBeGreaterThan(1);
    expect(scaleAfterNudge).toBeLessThan(1.01);

    const image = getViewerImage() as HTMLImageElement;
    fireEvent.pointerDown(image, { clientX: 500, clientY: 400, pointerId: 1 });
    fireEvent.pointerMove(image, { clientX: 300, clientY: 400, pointerId: 1 });

    pressKey('Escape');

    const pendingBeforeRelease = motionMock.pending.length;
    fireEvent.pointerUp(image, { clientX: 300, clientY: 400, pointerId: 1 });
    expect(motionMock.pending.length).toBe(pendingBeforeRelease);

    flushAnimations();

    expect(isOpen()).toBe(false);
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });
});

describe('keyboard shortcuts', () => {
  it.each([['+'], ['=']])('zooms in on %s', (key) => {
    mount();

    pressZoomKey(key);

    expect(readTransform().scale).toBe(1.5);
  });

  it('zooms out on - and stops at clean fit', () => {
    mount();
    pressZoomKey('+');
    pressZoomKey('+');
    expect(readTransform().scale).toBe(2.25);

    pressZoomKey('-');
    expect(readTransform().scale).toBe(1.5);

    pressZoomKey('-');
    pressZoomKey('-');
    expect(readTransform().scale).toBe(1);
  });

  it('resets on 0', () => {
    mount();
    pressKey('+');
    pressKey('+');

    pressKey('0');
    flushAnimations();

    expect(readTransform()).toEqual({ scale: 1, x: 0, y: 0 });
  });

  it('ignores shortcuts that carry a browser zoom modifier', () => {
    mount();

    fireEvent.keyDown(document.body, { key: '+', metaKey: true });

    expect(readTransform().scale).toBe(1);
  });

  it('detaches the key listener when the viewer unmounts', () => {
    mount();
    const image = getViewerImage() as HTMLImageElement;
    fireEvent.click(getPopup() as HTMLElement);
    flushAnimations();
    const before = image.style.transform;

    pressKey('+');

    expect(isOpen()).toBe(false);
    expect(image.style.transform).toBe(before);
  });

  it('leaves ArrowLeft/ArrowRight unhandled for a standalone (non-gallery) session', () => {
    mount();

    const left = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'ArrowLeft',
    });
    document.body.dispatchEvent(left);
    expect(left.defaultPrevented).toBe(false);

    const right = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'ArrowRight',
    });
    document.body.dispatchEvent(right);
    expect(right.defaultPrevented).toBe(false);
  });
});

describe('close branch', () => {
  it('waits out the double click window before closing on a lone image click', () => {
    mount();

    clickImage();
    expect(isOpen()).toBe(true);

    settleDoubleClickWindow();
    flushAnimations();

    expect(isOpen()).toBe(false);
  });

  it.each([
    ['the backdrop', () => fireEvent.click(getBackdrop() as HTMLElement)],
    ['the popup surface', () => fireEvent.click(getPopup() as HTMLElement)],
    ['the close button', () => fireEvent.click(getCloseButton() as HTMLElement)],
    ['Escape', () => pressKey('Escape')],
  ])('closes without waiting when dismissed via %s', (_label, dismiss) => {
    mount();

    dismiss();
    flushAnimations();

    expect(isOpen()).toBe(false);
  });

  it('abandons the pending close when a zoom lands inside the window', () => {
    mount();

    clickImage();
    wheel({ ctrlKey: true, deltaY: -100 });
    settleDoubleClickWindow();
    flushAnimations();

    expect(isOpen()).toBe(true);
    expect(readTransform().scale).toBeCloseTo(1.2214, 4);
  });

  it('abandons the pending close when a drag starts inside the window', () => {
    mount();
    const image = getViewerImage() as HTMLImageElement;
    clickImage();

    fireEvent.pointerDown(image, { clientX: 500, clientY: 400, pointerId: 1 });
    settleDoubleClickWindow();
    expect(isOpen()).toBe(true);

    fireEvent.pointerMove(image, { clientX: 440, clientY: 400, pointerId: 1 });
    fireEvent.pointerUp(image, { clientX: 440, clientY: 400, pointerId: 1 });
    settleDoubleClickWindow();
    flushAnimations();

    expect(isOpen()).toBe(true);
  });

  it.each([
    ['Escape', () => pressKey('Escape')],
    ['a backdrop click', () => fireEvent.click(getBackdrop() as HTMLElement)],
    [
      'a wheel close',
      () => {
        wheel({ deltaY: 60 });
        wheel({ deltaY: 60 });
      },
    ],
  ])('closes exactly once when %s lands inside the window', (_label, dismiss) => {
    const onOpenChange = vi.fn();
    mountReporting(onOpenChange);

    clickImage();
    dismiss();
    settleDoubleClickWindow();
    flushAnimations();

    expect(isOpen()).toBe(false);
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    expect(motionMock.pending).toHaveLength(0);
  });

  it('springs back to the thumbnail from clean fit', () => {
    mount();
    const image = getViewerImage() as HTMLImageElement;

    clickImage();
    settleDoubleClickWindow();
    flushAnimations();

    expect(image.style.opacity).toBe('1');
    expect(image.style.transform).toContain('scale(0.5)');
    expect(isOpen()).toBe(false);
  });

  it('fades out in place when the viewer is dirty', () => {
    mount();
    const image = getViewerImage() as HTMLImageElement;
    wheel({ ctrlKey: true, deltaY: -100 });
    expect(isOpen()).toBe(true);

    fireEvent.click(getCloseButton() as HTMLElement);
    flushAnimations();

    expect(image.style.opacity).toBe('0');
    expect(Number(/scale\((-?[\d.]+)\)/.exec(image.style.transform)?.[1])).toBeCloseTo(1.1237, 4);
    expect(isOpen()).toBe(false);
  });
});

describe('cursor', () => {
  it('offers zoom-out at clean fit and grab once zoomed', () => {
    mount({ height: 2000, width: 4000 });
    const image = getViewerImage() as HTMLImageElement;
    expect(image.style.cursor).toBe('zoom-out');

    doubleClickImage();
    expect(image.style.cursor).toBe('grab');

    fireEvent.pointerDown(image, { clientX: 500, clientY: 400, pointerId: 1 });
    expect(image.style.cursor).toBe('grabbing');

    fireEvent.pointerUp(image, { clientX: 500, clientY: 400, pointerId: 1 });
    expect(image.style.cursor).toBe('grab');
  });
});
