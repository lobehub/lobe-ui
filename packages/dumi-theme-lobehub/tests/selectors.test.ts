import { siteSelectors, SiteStore } from 'dumi-theme-lobehub';

describe('tokenSel function', () => {
  it('should return merged token object', () => {
    const s = {
      routeMeta: {
        frontmatter: {
          token: {
            foo: 'bar',
          },
        },
      },
      siteData: {
        themeConfig: {
          siteToken: {
            baz: 'qux',
          },
        },
      },
    } as unknown as SiteStore;

    const expected = {
      foo: 'bar',
      baz: 'qux',
    };

    const result = siteSelectors.token(s);

    expect(result).toEqual(expected);
  });
});
