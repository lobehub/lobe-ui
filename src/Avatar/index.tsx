import { Avatar as A } from 'antd';
import { FC } from 'react';
import { Center } from 'react-layout-kit';

import { useStyles } from './style';

export interface AvatarProps {
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

const Avatar: FC<AvatarProps> = ({ avatar, title, size = 40, shape = 'circle', background }) => {
  const { styles, theme } = useStyles();

  const backgroundColor = background ?? theme.colorBgContainer;

  const isImage = avatar && ['/', 'http', 'data:'].some((i) => avatar.startsWith(i));

  return (
    <Center
      className={styles.container}
      style={{
        width: size,
        height: size,
        borderRadius: shape === 'circle' ? '50%' : 6,
        backgroundColor,
        borderWidth: isImage ? 1 : 0,
      }}
    >
      {!avatar ? (
        <A shape={shape} size={size}>
          {title?.slice(0, 2)}
        </A>
      ) : isImage ? (
        <A className={styles.border} shape={shape} size={size} src={avatar} />
      ) : (
        <Center
          className={styles.border}
          style={{
            width: size,
            height: size,
            fontSize: size / 2,
            borderRadius: shape === 'circle' ? '50%' : 6,
            backgroundColor,
          }}
        >
          {avatar}
        </Center>
      )}
    </Center>
  );
};

export default Avatar;
