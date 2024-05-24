import { CdnFn, JsdelivrFn } from '@/ConfigProvider';

export type EmojiType = 'anim' | 'flat' | 'modern' | 'mono' | 'pure' | '3d';

export function isFlagEmoji(emoji: string) {
  const flagRegex = /(?:\uD83C[\uDDE6-\uDDFF]){2}/;
  return flagRegex.test(emoji);
}

export function emojiToUnicode(emoji: string) {
  return [...emoji].map((char) => char?.codePointAt(0)?.toString(16)).join('-');
}

export const genEmojiUrl = (
  emoji: string,
  type: EmojiType,
  { genCdnUrl, genJsdelivrUrl }: { genCdnUrl: CdnFn; genJsdelivrUrl: JsdelivrFn },
) => {
  const ext = ['anim', '3d'].includes(type) ? 'webp' : 'svg';

  switch (type) {
    case 'pure': {
      return null;
    }
    case 'anim': {
      return genJsdelivrUrl({
        path: `packages/${type}/assets/${emojiToUnicode(emoji)}.${ext}`,
        repo: 'lobehub/fluent-emoji',
      });
    }
    case '3d': {
      return genCdnUrl({
        path: `assets/${emojiToUnicode(emoji)}.${ext}`,
        pkg: '@lobehub/fluent-emoji-3d',
        version: '1.1.0',
      });
    }
    case 'flat': {
      return genCdnUrl({
        path: `assets/${emojiToUnicode(emoji)}.${ext}`,
        pkg: '@lobehub/fluent-emoji-flat',
        version: '1.1.0',
      });
    }
    case 'modern': {
      return genCdnUrl({
        path: `assets/${emojiToUnicode(emoji)}.${ext}`,
        pkg: '@lobehub/fluent-emoji-modern',
        version: '1.0.0',
      });
    }
    case 'mono': {
      return genCdnUrl({
        path: `assets/${emojiToUnicode(emoji)}.${ext}`,
        pkg: '@lobehub/fluent-emoji-mono',
        version: '1.1.0',
      });
    }
  }
};
