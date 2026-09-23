import { lobePrismTheme, lobeSyntax } from './syntaxTheme';

it('paints the live editor with lobe theme css variables', () => {
  const colors = [
    lobePrismTheme.plain.color,
    lobeSyntax.plain,
    ...lobePrismTheme.styles.map((item) => item.style.color),
  ].map(String);

  expect(colors.every((color) => color.startsWith('var(--'))).toBe(true);
  expect(JSON.stringify(lobePrismTheme)).not.toMatch(/#[0-9a-f]{3,8}/i);
});
