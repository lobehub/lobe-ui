import { describe, expect, it } from 'vitest';

import { styles } from '../style';

/** antd-style static styles inject into document <style> tags on import. */
const cssText = () =>
  [...document.querySelectorAll('style')].map((node) => node.textContent ?? '').join('\n');

const ruleFor = (className: string) => {
  const text = cssText();
  const blocks = text.split('}').filter((block) => block.includes(`.${className}`));
  return blocks.join('}');
};

describe('Table outlined / filled rounded corners', () => {
  it('defines the corner radius vars on the container for outlined and filled', () => {
    for (const cls of [styles.outlined, styles.filled]) {
      const css = ruleFor(cls.split(' ')[0]);
      expect(css).toMatch(/--lobe-table-radius-top:/);
      expect(css).toMatch(/--lobe-table-radius-bottom:/);
    }
  });

  it('rounds the FixedFrost panes on their outer corners', () => {
    const start = ruleFor(styles.frostStart.split(' ')[0]);
    const end = ruleFor(styles.frostEnd.split(' ')[0]);
    expect(start).toMatch(/border-start-start-radius:\s*var\(--lobe-table-radius-top/);
    expect(start).toMatch(/border-end-start-radius:\s*var\(--lobe-table-radius-bottom/);
    expect(end).toMatch(/border-start-end-radius:\s*var\(--lobe-table-radius-top/);
    expect(end).toMatch(/border-end-end-radius:\s*var\(--lobe-table-radius-bottom/);
    expect(end).toMatch(/backdrop-filter:\s*blur\(16px\)/);
  });

  it('gives the corner cells (incl. fixed ones) the matching radius', () => {
    const css = ruleFor(styles.outlined.split(' ')[0]);
    expect(css).toMatch(
      /thead\s*>\s*tr:first-child\s*>\s*:first-child[^{]*\{[^}]*border-start-start-radius/,
    );
    expect(css).toMatch(
      /thead\s*>\s*tr:first-child\s*>\s*:last-child[^{]*\{[^}]*border-start-end-radius/,
    );
    expect(css).toMatch(
      /tbody\s*>\s*tr:last-child\s*>\s*:first-child[^{]*\{[^}]*border-end-start-radius/,
    );
    expect(css).toMatch(
      /tbody\s*>\s*tr:last-child\s*>\s*:last-child[^{]*\{[^}]*border-end-end-radius/,
    );
  });

  it('uses the inner radius (outer minus the 1px frame) for outlined', () => {
    expect(ruleFor(styles.outlined.split(' ')[0])).toMatch(/--lobe-table-radius-top:\s*calc\(/);
  });

  it('drops the top / bottom radius next to title / footer', () => {
    const css = ruleFor(styles.outlined.split(' ')[0]);
    expect(css).toMatch(/--lobe-table-radius-top:\s*0px/);
    expect(css).toMatch(/--lobe-table-radius-bottom:\s*0px/);
  });
});
