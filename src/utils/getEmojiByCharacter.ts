import emojiRegex from 'emoji-regex';
import emojilib from 'emojilib';

export const getEmoji = (emoji: string): string | undefined => {
  const regex = emojiRegex();
  const pureEmoji = emoji.match(regex)?.[0];
  return pureEmoji;
};

export const getEmojiNameByCharacter = (emoji: string): string | undefined => {
  const pureEmoji = getEmoji(emoji);
  if (!pureEmoji) return;
  const EmojiLab: any = emojilib;
  return EmojiLab?.[pureEmoji]?.[0];
};
