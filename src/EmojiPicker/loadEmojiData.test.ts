import { loadEmojiData } from './loadEmojiData';

describe('loadEmojiData', () => {
  test('resolves the emoji-mart native set on demand', async () => {
    const data = (await loadEmojiData()) as {
      categories: unknown[];
      emojis: Record<string, unknown>;
    };
    expect(data.categories.length).toBeGreaterThan(0);
    expect(data.emojis).toHaveProperty('grinning');
  });
});
