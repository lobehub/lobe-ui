import { Avatar as AntAvatar, type AvatarProps as AntAvatarProps } from 'antd';
import { memo } from 'react';

import { useStyles } from './style';

export interface AvatarProps extends AntAvatarProps {
  /**
   * @description The URL or base64 data of the avatar image
   */
  avatar?: string;
  /**
   * @description The background color of the avatar
   */
  background?: string;
  /**
   * @description The shape of the avatar
   * @default 'circle'
   */
  shape?: 'circle' | 'square';
  /**
   * @description The size of the avatar in pixels
   * @default 40
   */
  size?: number;
  /**
   * @description The title text to display if avatar is not provided
   */
  title?: string;
}

const Avatar = memo<AvatarProps>(
  ({ className, avatar, title, size = 40, shape = 'circle', background, ...props }) => {
    const isImage = Boolean(
      avatar && ['/', 'http', 'data:'].some((index) => avatar.startsWith(index)),
    );
    const isEmoji = Boolean(
      avatar && !isImage && /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g.test(avatar),
    );

    const { styles, cx } = useStyles({ background, isEmoji, size });

    const text = isImage ? title : avatar;

    return isImage ? (
      <AntAvatar
        className={cx(styles.avatar, className)}
        shape={shape}
        size={size}
        src={avatar}
        {...props}
      />
    ) : (
      <AntAvatar className={cx(styles.avatar, className)} shape={shape} size={size} {...props}>
        {isEmoji ? text : text?.toUpperCase().slice(0, 2)}
      </AntAvatar>
    );
  },
);

export default Avatar;
