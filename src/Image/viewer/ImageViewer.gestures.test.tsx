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
});

describe('keyboard shortcuts', () => {
  it.each([['+'], ['=']])('zooms in on %s', (key) => {
    mount();

    pressKey(key);

    expect(readTransform().scale).toBe(1.5);
  });

  it('zooms out on - and stops at clean fit', () => {
    mount();
    pressKey('+');
    pressKey('+');
    expect(readTransform().scale).toBe(2.25);

    pressKey('-');
    expect(readTransform().scale).toBe(1.5);

    pressKey('-');
    pressKey('-');
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
