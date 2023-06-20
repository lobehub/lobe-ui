import { kebabCase } from 'lodash-es';
import { Loader2 } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';

import Icon from '@/Icon';
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
  ({ emoji, className, style, type = 'modern', size = 40, ...props }) => {
    const [loading, setLoading] = useState(true);
    const [loadingFail, setLoadingFail] = useState(false);
    const { cx, styles } = useStyles();

    useEffect(() => {
      setLoading(true);
    }, [emoji]);

    const emojiName = useMemo(() => getEmojiNameByCharacter(emoji), [emoji]);

    if (!emojiName || loadingFail)
      return (
        <div
          className={cx(styles.container, className)}
          style={{ fontSize: size, height: size, width: size, ...style }}
          {...props}
        >
          {emoji}
        </div>
      );

    return (
      <div
        className={cx(styles.container, className)}
        style={{ height: size, width: size, ...style }}
        {...props}
      >
        {loading && (
          <div className={styles.loading}>
            <Icon icon={Loader2} size={{ fontSize: size * 0.75 }} spin />
          </div>
        )}
        <img
          alt={emojiName}
          height="100%"
          onError={() => setLoadingFail(true)}
          onLoad={() => setLoading(false)}
          src={`https://npm.elemecdn.com/fluentui-emoji/icons/${type}/${kebabCase(emojiName)}.svg`}
          style={{ opacity: loading ? 0 : 1 }}
          width="100%"
        />
      </div>
    );
  },
);

export default FluentEmoji;
