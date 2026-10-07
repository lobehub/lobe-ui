// @vitest-environment node

import { css, cx, extractStaticStyle, injectGlobal } from './css';

describe('extractStaticStyle', () => {
  const used = cx(css`
    color: rgb(1 2 3);
  `);
  const unused = cx(css`
    color: rgb(4 5 6);
  `);
  injectGlobal`
    .extract-global-probe {
      color: rgb(7, 8, 9);
    }
  `;

  it('keeps only the classes the html uses, plus global styles', () => {
    const [style] = extractStaticStyle(`<div class="${used}"></div>`);

    expect(style.css).toContain('rgb(1, 2, 3)');
    expect(style.css).toContain('rgb(7, 8, 9)');
    expect(style.css).not.toContain('rgb(4, 5, 6)');
    expect(style.tag).not.toContain(unused.replace('acss-', ''));
  });

  it('returns every inserted style without html', () => {
    const [style] = extractStaticStyle();

    expect(style.css).toContain('rgb(1, 2, 3)');
    expect(style.css).toContain('rgb(4, 5, 6)');
  });
});
