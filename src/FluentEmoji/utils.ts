export type EmojiType = 'anim' | 'flat' | 'modern' | 'mono' | 'pure' | '3d';

function isFlagEmoji(emoji: string) {
  const flagRegex = /(?:\uD83C[\uDDE6-\uDDFF]){2}/;
  return flagRegex.test(emoji);
}

function emojiToUnicode(emoji: string) {
  return [...emoji].map((char) => char?.codePointAt(0)?.toString(16)).join('-');
}

export const genEmojiUrl = (emoji: string, type: EmojiType) => {
  if (isFlagEmoji(emoji))
    return `https://jsdelivr.lobehub-inc.cn/gh/RealityRipple/emoji/noto/${emojiToUnicode(emoji)}.png`;
  if (type === 'pure') return null;
  const ext = ['anim', '3d'].includes(type) ? 'webp' : 'svg';
  return `https://jsdelivr.lobehub-inc.cn/gh/lobehub/fluent-emoji/packages/${type}/assets/${emojiToUnicode(emoji)}.${ext}`;
};
