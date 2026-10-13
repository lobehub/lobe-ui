import { gridTemplateColumns } from './style';

describe('Grid columns', () => {
  test('the minimum column width never exceeds the container', () => {
    expect(gridTemplateColumns).toContain('min(var(--max-item-width), 100%)');
  });
});
