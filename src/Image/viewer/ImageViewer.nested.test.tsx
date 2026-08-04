import { fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { type ReactNode, useState } from 'react';

import { Drawer } from '@/base-ui/Drawer';
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

class FakePreloader {
  private handlers = new Map<string, Set<() => void>>();
  src = '';

  addEventListener(type: string, handler: () => void) {
    const set = this.handlers.get(type) ?? new Set();
    set.add(handler);
    this.handlers.set(type, set);
  }

  removeEventListener(type: string, handler: () => void) {
    this.handlers.get(type)?.delete(handler);
  }
}

const stubRect = (element: HTMLElement, rect: Partial<DOMRect>) => {
  const resolved = { height: 150, left: 100, top: 50, width: 200, ...rect };
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

const getViewerBackdrop = () => document.querySelector<HTMLElement>('.viewerBackdrop');
const getViewerPopup = () => document.querySelector<HTMLElement>('.viewerPopup');

const openViewer = () => {
  const thumbnail = screen.getByAltText('cat') as HTMLImageElement;
  Object.defineProperty(thumbnail, 'naturalWidth', { configurable: true, value: 400 });
  Object.defineProperty(thumbnail, 'naturalHeight', { configurable: true, value: 300 });
  stubRect(thumbnail, {});
  fireEvent.click(thumbnail);
};

const DrawerWithImage = () => {
  const [open, setOpen] = useState(true);

  return (
    <Drawer open={open} placement={'right'} title={'Attachments'} onClose={() => setOpen(false)}>
      <ImageComponent alt={'cat'} src={'https://example.com/cat.png'} />
    </Drawer>
  );
};

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024, writable: true });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 768, writable: true });
  vi.stubGlobal('Image', FakePreloader);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('viewer backdrop', () => {
  it('renders on its own', () => {
    renderWithMotion(<ImageComponent alt={'cat'} src={'https://example.com/cat.png'} />);
    openViewer();

    expect(getViewerPopup()).not.toBeNull();
    expect(getViewerBackdrop()).not.toBeNull();
  });

  it('still renders when the viewer opens from inside a drawer', () => {
    renderWithMotion(<DrawerWithImage />);
    openViewer();

    expect(getViewerPopup()).not.toBeNull();
    // Base UI drops a nested dialog's backdrop by default, which would leave the
    // viewer relying on whatever surface it happens to open above.
    expect(getViewerBackdrop()).not.toBeNull();
  });
});
