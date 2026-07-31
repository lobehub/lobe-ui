import { fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Drawer from '../Drawer';
import type { DrawerPlacement } from '../type';

// Echoes each style key back as its own class name so surface variants stay assertable.
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

const renderWithProvider = (node: ReactNode) =>
  render(<ConfigProvider motion={motion}>{node}</ConfigProvider>);

const getPanel = () => document.querySelector('[data-drawer-placement]');

describe('Drawer', () => {
  test('renders title, extra, footer, and children when open', () => {
    renderWithProvider(
      <Drawer open extra={<button>Share</button>} footer={<button>Save</button>} title="Settings">
        <div>Drawer body</div>
      </Drawer>,
    );

    expect(screen.getByText('Settings')).toBeDefined();
    expect(screen.getByText('Share')).toBeDefined();
    expect(screen.getByText('Save')).toBeDefined();
    expect(screen.getByText('Drawer body')).toBeDefined();
  });

  test('renders nothing while closed', () => {
    renderWithProvider(<Drawer open={false} title="Settings" />);

    expect(screen.queryByText('Settings')).toBeNull();
  });

  test.each(['bottom', 'left', 'right', 'top'] as DrawerPlacement[])(
    'anchors the panel to the %s edge',
    (placement) => {
      renderWithProvider(
        <Drawer open placement={placement} title="Settings">
          Body
        </Drawer>,
      );

      expect(getPanel()?.getAttribute('data-drawer-placement')).toBe(placement);
    },
  );

  test('defaults to the right edge', () => {
    renderWithProvider(
      <Drawer open title="Settings">
        Body
      </Drawer>,
    );

    expect(getPanel()?.getAttribute('data-drawer-placement')).toBe('right');
  });

  test('closes through the close button', () => {
    const onClose = vi.fn();
    renderWithProvider(
      <Drawer open title="Settings" onClose={onClose}>
        Body
      </Drawer>,
    );

    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('omits the close button when closable is false', () => {
    renderWithProvider(
      <Drawer open closable={false} title="Settings">
        Body
      </Drawer>,
    );

    expect(screen.queryByLabelText('Close')).toBeNull();
  });

  test('hides the header but keeps the close affordance when noHeader is set', () => {
    renderWithProvider(
      <Drawer noHeader open title="Settings">
        Body
      </Drawer>,
    );

    expect(screen.queryByText('Settings')).toBeNull();
    expect(screen.getByLabelText('Close')).toBeDefined();
  });

  test('renders both columns in sidebar mode', () => {
    renderWithProvider(
      <Drawer open sidebar={<nav>Sections</nav>} title="Settings">
        <div>Section body</div>
      </Drawer>,
    );

    expect(screen.getByText('Sections')).toBeDefined();
    expect(screen.getByText('Section body')).toBeDefined();
  });

  test('closes on Escape', () => {
    const onClose = vi.fn();
    renderWithProvider(
      <Drawer open title="Settings" onClose={onClose}>
        Body
      </Drawer>,
    );

    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  test('ignores Escape when keyboard is false', () => {
    const onClose = vi.fn();
    renderWithProvider(
      <Drawer open keyboard={false} title="Settings" onClose={onClose}>
        Body
      </Drawer>,
    );

    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  test('renders a nested drawer inside its parent', () => {
    renderWithProvider(
      <Drawer open title="Incident">
        <span>Summary</span>
        <Drawer open title="Timeline">
          <span>Events</span>
        </Drawer>
      </Drawer>,
    );

    expect(screen.getByText('Summary')).toBeDefined();
    expect(screen.getByText('Events')).toBeDefined();
    expect(document.querySelectorAll('[data-drawer-placement]')).toHaveLength(2);
  });

  test('keeps the anchored edge while exiting, even if placement changes on close', () => {
    const { rerender } = renderWithProvider(
      <Drawer open placement="left" title="Settings">
        Body
      </Drawer>,
    );

    expect(document.querySelector('[data-drawer-anchor]')?.getAttribute('data-drawer-anchor')).toBe(
      'left',
    );

    rerender(
      <ConfigProvider motion={motion}>
        <Drawer open={false} placement="right" title="Settings">
          Body
        </Drawer>
      </ConfigProvider>,
    );

    const anchor = document.querySelector('[data-drawer-anchor]');
    expect(anchor?.getAttribute('data-drawer-anchor')).toBe('left');
    expect(
      anchor?.querySelector('[data-drawer-placement]')?.getAttribute('data-drawer-placement'),
    ).toBe('left');
  });

  test('rounds only the edges facing content', () => {
    renderWithProvider(
      <Drawer open placement="bottom" title="Settings">
        Body
      </Drawer>,
    );

    expect(getPanel()?.className).toContain('panelRoundedBottom');
    expect(getPanel()?.className).not.toContain('panelFlush');
  });

  test('drops the cast and the radius once it fills the viewport', () => {
    renderWithProvider(
      <Drawer open title="Settings" width="100%">
        Body
      </Drawer>,
    );

    expect(getPanel()?.className).toContain('panelFlush');
    expect(getPanel()?.className).not.toContain('panelRounded');
  });

  test('deepens the cast when there is no backdrop to separate it', () => {
    renderWithProvider(
      <Drawer open mask={false} title="Settings">
        Body
      </Drawer>,
    );

    expect(getPanel()?.className).toContain('panelBoosted');
  });

  test('lightens the cast on an ancestor that a nested drawer pushed aside', () => {
    renderWithProvider(
      <Drawer open title="Incident">
        <Drawer open title="Timeline">
          Events
        </Drawer>
      </Drawer>,
    );

    const [outer, inner] = document.querySelectorAll('[data-drawer-placement]');
    expect(outer.className).toContain('panelRecessed');
    expect(inner.className).not.toContain('panelRecessed');
  });

  test('follows a placement change while it stays open', () => {
    const { rerender } = renderWithProvider(
      <Drawer open placement="left" title="Settings">
        Body
      </Drawer>,
    );

    rerender(
      <ConfigProvider motion={motion}>
        <Drawer open placement="bottom" title="Settings">
          Body
        </Drawer>
      </ConfigProvider>,
    );

    expect(document.querySelector('[data-drawer-anchor]')?.getAttribute('data-drawer-anchor')).toBe(
      'bottom',
    );
  });
});
