import { useLocalStorageState } from 'ahooks';
import { kebabCase } from 'lodash-es';
import { memo, useEffect, useState } from 'react';

import { DivProps } from '@/types';
import { getEmojiNameByCharacter } from '@/utils/getEmojiByCharacter';

import { useStyles } from './style';

export interface FluentEmojiProps extends DivProps {
  /**
   * @description The emoji character to be rendered
   */
  emoji: string;
  /**
   * @description Size of the emoji
   * @default 40
   */
  size?: number;
  /**
   * @description The type of the FluentUI emoji set to be used
   * @default 'modern'
   */
  type?: 'modern' | 'flat' | 'high-contrast';
}

const FluentEmoji = memo<FluentEmojiProps>(
  ({ emoji, className, style, type = 'modern', size = 40 }) => {
    const [loadingFail, setLoadingFail] = useState(false);
    const [emojiUrl, setEmojiUrl] = useLocalStorageState<{ [key: string]: string }>(
      'lobe-ui-emoji',
      {
        defaultValue: {},
      },
    );
    const { cx, styles } = useStyles();

    useEffect(() => {
      if (emojiUrl?.[emoji] || emojiUrl?.[emoji] === 'none') return;
      const emojiName = getEmojiNameByCharacter(emoji);
      if (emojiName) {
        setEmojiUrl({
          ...emojiUrl,
          [emoji]: `https://npm.elemecdn.com/fluentui-emoji/icons/${type}/${kebabCase(
            emojiName,
          )}.svg`,
        });
      } else {
        setEmojiUrl({ ...emojiUrl, [emoji]: 'none' });
      }
    }, [emoji, emojiUrl]);

    if (emojiUrl?.[emoji] === 'none' || loadingFail)
      return (
        <div
          className={cx(styles.container, className)}
          style={{ fontSize: size, height: size, width: size, ...style }}
        >
          {emoji}
        </div>
      );

    return (
      <div
        className={cx(styles.container, className)}
        style={{ height: size, width: size, ...style }}
      >
        <img
          alt={emoji}
          height="100%"
          loading="lazy"
          onError={() => setLoadingFail(true)}
          src={emojiUrl?.[emoji]}
          width="100%"
        />
      </div>
    );
  },
);

export default FluentEmoji;
