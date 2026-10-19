import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

describe('class tables for components without a published docs page', () => {
  it('lists them on the styling overrides guide', () => {
    const guide = readFileSync(resolve(__dirname, '../docs/styling-overrides.mdx'), 'utf8');
    for (const name of [
      'aClasses',
      'autoCompleteClasses',
      'checkboxClasses',
      'checkboxGroupClasses',
      'formClasses',
      'inputClasses',
      'inputNumberClasses',
      'inputOTPClasses',
      'inputPasswordClasses',
      'textAreaClasses',
    ]) {
      expect(guide).toContain(`<StableClassTable of={${name}} />`);
    }
  });
});
