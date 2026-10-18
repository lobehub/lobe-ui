import { cleanup, render } from '@testing-library/react';

import { TableSkeleton } from '@/dashboard';
import { Tabs } from '@/index';
import { Callout, Tab, Tabs as MdxTabs } from '@/mdx';

afterEach(cleanup);

describe('subpath stable classes', () => {
  it('keeps mdx/Tabs and root Tabs on separate blocks', () => {
    const { container: mdx } = render(
      <MdxTabs items={['A', 'B']}>
        <Tab>A</Tab>
        <Tab>B</Tab>
      </MdxTabs>,
    );
    const mdxRoot = mdx.firstElementChild!;
    expect(mdxRoot.classList.contains('lobe-mdx-tabs')).toBe(true);
    expect(mdxRoot.classList.contains('lobe-tabs')).toBe(false);
    expect(mdx.querySelector('.lobe-mdx-tabs__nav')?.classList.contains('lobe-tabs')).toBe(true);
    cleanup();

    const { container: root } = render(<Tabs items={[{ key: 'a', label: 'A' }]} />);
    expect(root.firstElementChild?.classList.contains('lobe-tabs')).toBe(true);
    expect(root.querySelector('[class*="lobe-mdx-tabs"]')).toBeNull();
  });

  it('colors mdx/Callout through StyleX instead of inline styles', () => {
    const { container } = render(<Callout type="warning">Note</Callout>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.type).toBe('warning');
    expect(root.style.background).toBe('');
    expect(root.style.color).toBe('');
    expect(getComputedStyle(root).color).toBe('var(--lobe-color-warning)');
  });

  it('keeps dashboard skeleton bones at their own size over the Skeleton default', () => {
    const { container } = render(<TableSkeleton rows={1} />);
    const tag = container.querySelector<HTMLElement>('.lobe-dashboard-table-skeleton__tag')!;
    const cell = container.querySelector<HTMLElement>('.lobe-dashboard-table-skeleton__cell')!;
    expect(getComputedStyle(tag).height).toBe('22px');
    expect(getComputedStyle(tag).width).toBe('72px');
    expect(getComputedStyle(cell).height).toBe('14px');
    expect(getComputedStyle(cell).width).toBe('88px');
  });
});
