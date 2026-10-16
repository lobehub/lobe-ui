import { staticStylish } from './customStylishStatic';

const emotionRules = () =>
  [...document.querySelectorAll<HTMLStyleElement>('style[data-emotion]')]
    .flatMap((node) => [...(node.sheet?.cssRules ?? [])].map((rule) => rule.cssText))
    .join('');

it('does not insert any styles until a class is read', () => {
  expect(emotionRules()).not.toContain('saturate(150%) blur(36px)');

  const className = staticStylish.blurStrong;

  expect(className).toMatch(/^acss-/);
  expect(emotionRules()).toContain('saturate(150%) blur(36px)');
});

it('behaves like a plain object for spreading and key checks', () => {
  const copy = { ...staticStylish };

  expect(Object.keys(copy)).toContain('variantOutlined');
  expect(copy.variantOutlined).toBe(staticStylish.variantOutlined);
  expect('gradientAnimation' in staticStylish).toBe(true);
});
