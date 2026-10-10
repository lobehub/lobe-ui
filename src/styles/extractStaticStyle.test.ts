// @vitest-environment node

import { css, cx, extractStaticStyle, injectGlobal } from './css';

describe('extractStaticStyle', () => {
  const used = cx(css`
    order: 101;
  `);
  const unused = cx(css`
    order: 102;
  `);
  injectGlobal`
    .extract-global-probe {
      order: 103;
    }
  `;

  it('keeps only the classes the html uses, plus global styles', () => {
    const [style] = extractStaticStyle(`<div class="${used}"></div>`);

    expect(style.css).toContain('order:101');
    expect(style.css).toContain('order:103');
    expect(style.css).not.toContain('order:102');
    expect(style.tag).not.toContain(unused.replace('acss-', ''));
  });

  it('returns every inserted style without html', () => {
    const [style] = extractStaticStyle();

    expect(style.css).toContain('order:101');
    expect(style.css).toContain('order:102');
  });
});
