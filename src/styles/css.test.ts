import { createStaticStyles } from './css';

const acssTags = () => document.querySelectorAll('style[data-emotion^="acss"]');

it('keeps every static rule in one style element', () => {
  const styles = createStaticStyles(({ css }) => ({
    a: css`
      order: 1;
    `,
    b: css`
      order: 2;
    `,
    c: css`
      &:hover {
        order: 3;
      }
    `,
  }));

  expect([styles.a, styles.b, styles.c].every((name) => name.startsWith('acss-'))).toBe(true);
  expect(acssTags()).toHaveLength(1);

  const rules = [...(acssTags()[0] as HTMLStyleElement).sheet!.cssRules].map(
    (rule) => rule.cssText,
  );

  expect(rules.join('')).toContain('order: 3');
});
